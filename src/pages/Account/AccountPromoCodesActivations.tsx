import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Loader from 'ui/lib/Loader';
import Paginator from 'ui/lib/Paginator';

import { Error } from 'src/components/Form/Form';
import { IStore } from 'src/store';
import { getPromoCodeActivations, IGetEventsRequestParams } from 'src/entities/Events/actions';
import { IUserCommonEvents } from 'src/entities/Events/store';

export interface IProps {
    events: IUserCommonEvents;
    loaders: {
        getEvents: boolean;
    };
}

export interface IOwnProps {
    userId: string;
}

export interface IActions {
    actions: {
        getPromoCodeActivations: (params: IGetEventsRequestParams) => void;
    };
}

import Table from 'src/components/Table/Table';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

import api from 'src/routes/api';

class AccountPromoCodesActivations extends React.PureComponent<IProps & IActions & IOwnProps, any> {
    componentDidMount() {
        const { userId } = this.props;

        this.props.actions.getPromoCodeActivations({ userId, from: 0, count: 10 });
    }

    onPageChange = (page: { selected: number; }) => {
        const { events } = this.props;

        this.props.actions.getPromoCodeActivations({
            userId: this.props.userId,
            count: events.count,
            from: page.selected * events.count
        });
    };

    render() {
        const { events, loaders } = this.props;
        const hasEvents = events && events.items.length > 0;
        const noData = events && events.items.length === 0;
        const pageCount = hasEvents && Math.ceil(events.total / events.count);

        return (<>
            {hasEvents && (<>
                <Table
                    data={events.items as any}
                    columns={[
                        { text: 'Дата', field: 'when' },
                        { text: 'Код', field: 'userEvent.promoCode.code' },
                        { text: 'Тип', getValue: (item) =>
                            item.userEvent.promoCode.components.map(component => component.type).join(', ')
                        },
                        { text: 'Оригинальное событие', field: 'userEvent', collapsible: true, format: 'json' },
                        { text: 'Контекст', field: 'context', collapsible: true, format: 'json' },
                        { text: 'IP', field: 'context.ip' }
                    ]}
                />
                {pageCount > 1 && (
                    <div className="mt-s inline-flex align-items-center">
                        <Paginator
                            theme="light"
                            pageCount={pageCount}
                            nextLabel="Следующий"
                            previousLabel="Предыдущий"
                            onPageChange={this.onPageChange}
                        />
                        {loaders.getEvents && (
                            <Loader size="small" className="inline ml-m" />
                        )}
                    </div>
                )}
            </>)}
            <Error
                showDetails
                className="text-align-left"
                route={api.events.getEvents}
            />
            {noData && (
                <div className="mt-s">Нет данных</div>
            )}
        </>);
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => ({
    events: state.events.promocodes[ownProps.userId]
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ getPromoCodeActivations }, dispatch)
})

const AccountPromoCodesActivationsWithConnect = connect(mapStateToProps, mapDispatchToProps)(AccountPromoCodesActivations);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.events.getEvents
    ]}>
        <AccountPromoCodesActivationsWithConnect {...props} />
    </RequestTracker>
);
