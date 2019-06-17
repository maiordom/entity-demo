import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IUserContactEvents } from 'src/entities/Events/store';
import { getContactsHistory, IGetEventsRequestParams } from 'src/entities/Events/actions';
import { IStore } from 'src/store';

import Pagination from 'src/components/Pagination/Pagination';
import { Error } from 'src/components/Form/Form';
import Loader from 'ui/lib/Loader';
import { Title } from 'src/components/Layout/Layout';
import Table from 'src/components/Table/Table';
import Paginator from 'ui/lib/Paginator';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

import api from 'src/routes/api';

interface IProps {
    perPageCount: number;
    events: IUserContactEvents;
    loaders?: {
        getEvents: boolean;
    };
}

interface IOwnProps {
    userId: string;
}

interface IActions {
    actions: {
        getContactsHistory: (params: IGetEventsRequestParams) => void;
    };
}

class AccountContactsHistory extends React.PureComponent<IProps & IOwnProps & IActions, any> {
    componentDidMount() {
        const { userId, perPageCount } = this.props;

        this.props.actions.getContactsHistory({
            userId,
            from: 0,
            count: perPageCount
        });
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.perPageCount !== this.props.perPageCount) {
            const { userId } = this.props;

            this.props.actions.getContactsHistory({
                userId,
                from: 0,
                count: nextProps.perPageCount
            });
        }
    }

    onPageChange = (page: { selected: number; }) => {
        const { events } = this.props;

        this.props.actions.getContactsHistory({
            userId: this.props.userId,
            count: events.count,
            from: page.selected * events.count
        });
    };

    render() {
        const { events, loaders, userId } = this.props;
        const hasEvents = events && events.items.length > 0;
        const noData = events && events.items.length === 0;
        const pageCount = hasEvents && Math.ceil(events.total / events.count);

        return (<>
            <Title className="font-size-large ml-none line-height-m inline align-items-center">
                История контактов
                {loaders.getEvents && (
                    <Loader className="ml-m inline" size="small" />
                )}
            </Title>
            {hasEvents && (<>
                <Table
                    locator="accounts-contact-history"
                    className="mt-s"
                    data={events.items as any}
                    columns={[
                        { text: 'Дата', field: 'when' },
                        { text: 'Тип', field: 'actionType' },
                        { text: 'Контакт', field: 'contactType' },
                        { text: 'Описание', field: 'value' },
                        { text: 'Сервис', field: 'context.application' },
                        { text: 'IP', field: 'context.ip' },
                        { text: 'Автор', field: 'userId' },
                        { text: 'Дополнительно', field: 'context', collapsible: true, format: 'json' }
                    ]}
                />
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
    perPageCount: state.pagination.perPageCountOptions.selected.value,
    events: state.events.contacts[ownProps.userId]
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getContactsHistory
    }, dispatch)
});

const AccountContactsHistoryWithConnect = connect(mapStateToProps, mapDispatchToProps)(AccountContactsHistory);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.events.getEvents,
    ]}>
        <AccountContactsHistoryWithConnect {...props} />
    </RequestTracker>
);
