import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { Error } from 'src/components/Form/Form';
import Spinner from 'ui/lib/Spinner';
import Paginator from 'ui/lib/Paginator';

import { Container, BanUntil, Reason, Date, Name, User, Delimiter } from 'src/components/Event/Event';

import { IAccount } from 'src/entities/Accounts/models/Account';
import { getBanEvents, IGetEventsRequestParams } from 'src/entities/Events/actions';
import { IStore } from 'src/store';
import { IUserCommonEvents } from 'src/entities/Events/store';

import api from 'src/routes/api';

interface IOwnProps {
    account: IAccount;
}

interface IProps {
    lang: string;
    events: IUserCommonEvents;
    loaders?: {
        getEvents: boolean;
    };
}

interface IActions {
    actions: {
        getBanEvents: (params: IGetEventsRequestParams) => void;
    };
}

type TProps = IOwnProps & IProps & IActions;

class AccountBanEvents extends React.PureComponent<TProps, {}> {
    componentDidMount() {
        const { id: userId } = this.props.account;

        this.props.actions.getBanEvents({ userId, from: 0, count: 10 });
    }

    onPageChange = (page: { selected: number; }) => {
        const { events } = this.props;

        this.props.actions.getBanEvents({
            userId: this.props.account.id,
            count: events.count,
            from: page.selected * events.count
        });
    };

    getEvent = (event) => {
        const { lang } = this.props;
        const isBannedEvent = event.userEvent.type === 'users.accounts.banned';
        let days = 0;

        if (isBannedEvent) {
            const untilDate = moment(event.userEvent.until);
            const when = moment(event.userEvent.when);
            const duration = moment.duration(untilDate.diff(when));

            days = Math.round(duration.asDays());
        }

        return (
            <Container className="mt-s mr-l">
                <div className="inline mb-xxs">
                    <Date>{event.userEvent.when}</Date>
                    <Delimiter />
                    <User>{event.userEvent.userId}</User>
                </div>
                {isBannedEvent
                    ? <BanUntil days={days} className="mb-s">{event.userEvent.until}</BanUntil>
                    : <Name className="mb-s font-size-large">Разбанен</Name>
                }
                <Reason
                    className="mb-s"
                    title="Внутренняя причина"
                    description={event.userEvent.reason.internal || '—'}
                />
                <Reason
                    title="Внешняя причина"
                    description={event.userEvent.reason.external[lang] || '—'}
                />
            </Container>
        );
    };

    render() {
        const { events, loaders } = this.props;
        const hasEvents = events && events.items.length > 0;
        const pageCount = hasEvents && Math.ceil(events.total / events.count);

        return (
            <div>
                <div className="font-size-large inline align-items-center line-height-m">
                    История банов
                    {loaders.getEvents && (
                        <Spinner size="small" className="inline ml-s" />
                    )}
                </div>
                {hasEvents ? (<>
                    {events.items.map(this.getEvent)}
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
                                <Spinner size="small" className="inline ml-m" />
                            )}
                        </div>
                    )}
                </>) : <div className="mt-s">Нет данных</div>}
                <Error
                    showDetails
                    className="mt-m text-align-left"
                    route={api.events.getEvents}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => ({
    events: state.events.ban[ownProps.account.id],
    lang: state.area.selected.lang
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getBanEvents
    }, dispatch)
})

const AccountBanEventsWithConnect = connect(mapStateToProps, mapDispatchToProps)(AccountBanEvents);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.events.getEvents
    ]}>
        <AccountBanEventsWithConnect {...props} />
    </RequestTracker>
);
