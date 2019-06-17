import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment, { Moment } from 'moment';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { Link } from 'react-router-dom'

import Loader from 'ui/lib/Loader';
import Paginator from 'ui/lib/Paginator';
import Button from 'ui/lib/Button';

import getAccountsByIds, { IGetAccountsByIdsRequestParams, IGetAccountsByIdsResult } from 'src/entities/Accounts/services/GetAccountsByIds';
import { setProfiles, ISetProfilesParams } from 'src/entities/Profiles/actions';
import Table from 'src/components/Table/Table';
import AccountEventViaCard from './AccountEventViaCard';
import { IProfiles } from 'src/entities/Profiles/store';
import { IPermissions } from 'src/entities/User/store';
import { Error } from 'src/components/Form/Form';
import { IUserCommonEvents } from 'src/entities/Events/store';
import { IStore } from 'src/store';
import { setSettings, ISetSettingsParams } from 'src/entities/Events/actions';
import { getEvents, IGetEventsRequestParams } from 'src/entities/Events/actions';
import { setProperty, ISetPropertyParams } from 'src/entities/Site/actions';
import { IUserEventAbstract } from 'src/entities/Events/store';
import { getRoute } from 'src/routes/client';
import { ITransaction } from 'src/entities/Billing/models/Transaction';

import Pagination from 'src/components/Pagination/Pagination';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import Calendar from 'src/components/Calendar/Calendar';
import Overlay from 'src/components/Overlay/Overlay';
import CancelWebshopOrder from './CancelWebshopOrder';
import CancelGameShopOrder from './CancelGameShopOrder';
import EventFilters from 'src/components/EventFilters/EventFilters';
import TransferPayment from 'src/pages/Transactions/TransferPayment';
import CancelPayment from 'src/pages/Transactions/CancelPayment';

import api from 'src/routes/api';

export interface IProps {
    permissions: IPermissions;
    profiles: IProfiles;
    lang: string;
    logView: string;
    currency: string;
    perPageCount: number;
    events: IUserCommonEvents;
    loaders: {
        getEvents: boolean;
    };
    eventTypes?: Array<string>;
    mapTypeToName?: {
        [type: string]: string;
    }
}

export interface IOwnProps {
    userId: string;
}

interface IState {
    currentEvent: IUserEventAbstract;
    currentTransaction: ITransaction;
}

export interface IActions {
    actions: {
        getEvents: (params: IGetEventsRequestParams) => Promise<Array<IUserEventAbstract>>;
        setSettings: (params: ISetSettingsParams) => void;
        setProperty: (params: ISetPropertyParams) => void;
        getAccountsByIds: (params: IGetAccountsByIdsRequestParams) => Promise<IGetAccountsByIdsResult>;
        setProfiles: (params: ISetProfilesParams) => void;
    };
}

const GET_EVENTS_DEBOUNCE_TIME = 2000;

import css from './AccountEvents.css';

class AccountEvents extends React.PureComponent<IProps & IActions & IOwnProps, IState> {
    static defaultProps = {
        events: {
            since: null,
            until: null,
            items: [],
            from: 0
        },
        eventType: [],
        mapTypeToName: {}
    };

    state = {
        currentEvent: null,
        currentTransaction: null
    };

    overlayPaymentTransferRef: React.RefObject<Overlay> = React.createRef();
    overlayCancelPaymentRef: React.RefObject<Overlay> = React.createRef();
    overlayCancelWebshopOrderRef: React.RefObject<Overlay> = React.createRef();
    overlayCancelGameShopOrderRef: React.RefObject<Overlay> = React.createRef();

    getEventsWithDelay = debounce((params: IGetEventsRequestParams) => {
        this.getEvents(params);
    }, GET_EVENTS_DEBOUNCE_TIME, {
        leading: true
    });

    getEvents(params: IGetEventsRequestParams) {
        this.props.actions.getEvents(params).then(events => {
            const { profiles } = this.props;

            const userIds = events.reduce((userIds, event) => {
                const { userEvent: { userId }, context: { operatorId } } = event;
                const id = operatorId || userId;

                if (!(id in profiles) && !userIds.includes(id)) {
                    userIds.push(id);
                }

                return userIds;
            }, []);

            this.props.actions.getAccountsByIds({ userIds }).then(({ accounts: profiles }) => {
                this.props.actions.setProfiles({ profiles });
            });
        });
    }

    componentDidMount() {
        const { userId, events: { since, until, from }, perPageCount, eventTypes } = this.props;

        this.getEvents({
            userId,
            from,
            count: perPageCount,
            since,
            until,
            eventType: eventTypes
        });
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.perPageCount !== this.props.perPageCount || nextProps.eventTypes !== this.props.eventTypes) {
            const { userId, events: { since, until } } = this.props;
            const { eventTypes } = nextProps;

            this.getEventsWithDelay({
                userId,
                from: 0,
                count: nextProps.perPageCount,
                since,
                until,
                eventType: eventTypes
            });
        }
    }

    onPageChange = (page: { selected: number; }) => {
        const { events: { count, since, until }, userId, eventTypes } = this.props;

        this.props.actions.setSettings({ page: page.selected, type: 'common', userId });
        this.getEvents({
            userId,
            since,
            until,
            count,
            from: page.selected * count,
            eventType: eventTypes
        });
    };

    onCancelWebshopOrder = (event: IUserEventAbstract) => {
        this.setState({ currentEvent: event });
        this.overlayCancelWebshopOrderRef.current.toggleVisibility(true);
    };

    onCancelGameShopOrder = (event: IUserEventAbstract) => {
        this.setState({ currentEvent: event });
        this.overlayCancelGameShopOrderRef.current.toggleVisibility(true);
    };

    onPaymentCancel = (event: IUserEventAbstract) => {
        const { payment } = event.userEvent;

        this.setState({
            currentEvent: event,
            currentTransaction: {
                id: null,
                type: 'payment',
                amount: payment.amount,
                whenCreated: payment.whenCreated,
                paymentId: payment.id,
                userId: payment.userId,
                createdBy: payment.createdBy,
                raw: {}
            }
        });

        this.overlayCancelPaymentRef.current.toggleVisibility(true);
    };

    onPaymentTransfer = (event: IUserEventAbstract) => {
        const { payment } = event.userEvent;

        this.setState({
            currentEvent: event,
            currentTransaction: {
                id: null,
                type: 'payment',
                amount: payment.amount,
                whenCreated: payment.whenCreated,
                paymentId: payment.id,
                userId: payment.userId,
                createdBy: payment.createdBy,
                raw: {}
            }
        });

        this.overlayPaymentTransferRef.current.toggleVisibility(true);
    };

    onSinceChange = (date: Moment) => {
        const since = moment(date).utc().format();
        const { events: { until }, userId, perPageCount, eventTypes } = this.props;

        this.props.actions.setSettings({ since, type: 'common', userId });
        this.getEvents({
            userId,
            count: perPageCount,
            from: 0,
            until,
            since,
            eventType: eventTypes
        });
    };

    onUntilChange = (date: Moment) => {
        const until = moment(date).utc().format();
        const { events: { since }, userId, perPageCount, eventTypes } = this.props;

        this.props.actions.setSettings({ until, type: 'common', userId });
        this.getEvents({
            userId,
            count: perPageCount,
            from: 0,
            until,
            since,
            eventType: eventTypes
        });
    };

    getEventViaCard = (event: IUserEventAbstract, index) => {
        const { mapTypeToName, lang, currency } = this.props;
        const name = mapTypeToName[event.eventType]
            ? mapTypeToName[event.eventType]
            : event.eventType;

        return (
            <AccountEventViaCard
                className="mt-s mr-l col-12"
                onCancelGameShopOrder={this.onCancelGameShopOrder}
                onCancelWebshopOrder={this.onCancelWebshopOrder}
                onPaymentCancel={this.onPaymentCancel}
                onPaymentTransfer={this.onPaymentTransfer}
                key={event.id}
                currency={currency}
                lang={lang}
                event={event}
                name={name}
            />
        );
    };

    getControl = (event: IUserEventAbstract) => {
        const { eventType } = event;
        const { permissions } = this.props;

        let onEventClick;

        if (eventType === 'users.payments.added' && 'b.t.w' in permissions) {
            return (<>
                <Button
                    className="mr-s"
                    onClick={() => this.onPaymentTransfer(event)}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Трансфер
                </Button>
                <Button
                    onClick={() => this.onPaymentCancel(event)}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Вернуть деньги
                </Button>
            </>);
        }

        if (eventType === 'users.orders.completed') {
            onEventClick = () => this.onCancelWebshopOrder(event);
        } else if (eventType === 'users.game.shop.order.completed') {
            onEventClick = () => this.onCancelGameShopOrder(event);
        } else {
            return null;
        }

        return (
            <Button
                onClick={onEventClick}
                theme="thin-black"
                mods={['size-small', 'font-size-small']}
            >
                Отмена транзакции
            </Button>
        );
    };

    cardView() {
        const { events } = this.props;

        return (
            events.items.map(this.getEventViaCard)
        );
    }

    tableView() {
        const { events, mapTypeToName, lang, currency, profiles } = this.props;

        return (
            <Table
                data={events.items as any}
                rowControls={this.getControl}
                columns={[
                    { text: 'Дата', field: 'when' },
                    {
                        text: 'Тип события',
                        field: 'eventType',
                        getValue: (item) =>
                            mapTypeToName[item.eventType]
                                ? mapTypeToName[item.eventType]
                                : item.eventType,
                        renderCell: (item, value) => (
                            <div
                                title={value}
                                className={css.eventType}
                            >
                                {value}
                            </div>
                        )
                    },
                    {
                        text: 'Автор',
                        field: 'userId',
                        renderCell: ({ context: { operatorId }, userId }) => {
                            const id = operatorId || userId;

                            return (
                                profiles[id]
                                    ? <Link to={getRoute('account', { id })}>
                                        {profiles[id] && (
                                            profiles[id].email ||
                                            profiles[id].username
                                        )}
                                    </Link>
                                    : id
                            );
                        }
                    },
                    { text: 'IP', field: 'context.ip' },
                    { text: 'Сервис', field: 'context.application' },
                    {
                        text: 'Информация',
                        hideKeys: true,
                        getValue: (event) => {
                            const events = [
                                'users.orders.completed',
                                'users.game.shop.order.completed'
                            ];

                            if (events.includes(event.eventType)) {
                                const product = get(event, 'userEvent.order.product');

                                if (!product) {
                                    return null;
                                }

                                return {
                                    'Название': product.mainProductName && product.mainProductName[lang] || product.name && product.name[lang],
                                    'Цена': `${product.referencePrice} ${currency}`,
                                    'Количество': `${product.quantity} шт.`
                                };
                            }

                            return null;
                        }
                    },
                    {
                        text: 'Данные',
                        getValue: (event) => ({
                            userEvent: event.userEvent,
                            context: event.context
                        }),
                        collapsible: true,
                        format: 'json'
                    }
                ]}
            />
        );
    }

    onViewClick = () => {
        const { logView } = this.props;

        this.props.actions.setProperty({
            paramName: 'logView',
            paramValue: logView === 'table' ? 'card' : 'table'
        });
    };

    render() {
        const { events, loaders, userId, logView } = this.props;
        const { currentEvent, currentTransaction } = this.state;
        const hasEvents = events && events.items.length > 0;
        const noData = events && events.items.length === 0;
        const pageCount = hasEvents && Math.ceil(events.total / events.count);

        return (<>
            <div key={userId} className="align-items-center inline mb-m">
                <EventFilters />
                <div className="inline ml-m">
                    <Calendar
                        date={events && events.since}
                        isOutsideRange={() => false}
                        className="col-4"
                        placeholder="С какой"
                        onChange={this.onSinceChange}
                    />
                    <Calendar
                        date={events && events.until}
                        isOutsideRange={() => false}
                        className="col-4 ml-m"
                        placeholder="По какую дату"
                        onChange={this.onUntilChange}
                    />
                </div>
                <Button
                    className="ml-m"
                    onClick={this.onViewClick}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    {logView === 'table' ? 'Карточки' : 'Табличный вид'}
                </Button>
            </div>
            {hasEvents && (<>
                <Overlay ref={this.overlayCancelWebshopOrderRef}>
                    <CancelWebshopOrder event={currentEvent} />
                </Overlay>
                <Overlay ref={this.overlayCancelGameShopOrderRef}>
                    <CancelGameShopOrder event={currentEvent} />
                </Overlay>
                <Overlay ref={this.overlayPaymentTransferRef}>
                    <TransferPayment
                        contact={currentTransaction && currentTransaction.userId}
                        transaction={currentTransaction}
                    />
                </Overlay>
                <Overlay ref={this.overlayCancelPaymentRef}>
                    <CancelPayment
                        transaction={currentTransaction}
                    />
                </Overlay>
                {logView === 'table'
                    ? this.tableView()
                    : this.cardView()
                }
                <div className="mt-s inline align-items-center">
                    {pageCount > 1 && (
                        <div className="mr-m">
                            <Paginator
                                key={userId}
                                forcePage={events.page}
                                theme="light"
                                pageCount={pageCount}
                                nextLabel="Следующий"
                                previousLabel="Предыдущий"
                                onPageChange={this.onPageChange}
                            />
                        </div>
                    )}
                    <Pagination />
                    {loaders.getEvents && (
                        <Loader size="small" className="inline ml-m" />
                    )}
                </div>
            </>)}
            <Error showDetails className="text-align-left mt-m" route={
                api.events.getEvents
            } />
            {noData && (
                <div className="mt-s">Нет данных</div>
            )}
        </>);
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => ({
    permissions: state.user.permissions,
    profiles: state.profiles,
    logView: state.site.logView,
    lang: state.area.selected.lang,
    currency: state.area.selected.sign,
    perPageCount: state.pagination.perPageCountOptions.selected.value,
    events: state.events.common[ownProps.userId],
    eventTypes: state.eventFilters.eventTypes,
    mapTypeToName: state.eventFilters.mapTypeToName
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        getAccountsByIds,
        ...bindActionCreators({
            getEvents,
            setSettings,
            setProperty,
            setProfiles
        }, dispatch)
    }
});

const AccountEventsWithConnect = connect(mapStateToProps, mapDispatchToProps)(AccountEvents);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.events.getEvents
    ]}>
        <AccountEventsWithConnect {...props} />
    </RequestTracker>
);
