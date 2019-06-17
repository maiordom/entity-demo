import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Title, Inner } from 'src/components/Layout/Layout';
import { Form, Row, Error } from 'src/components/Form/Form';
import Table from 'src/components/Table/Table';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import { getRoute } from 'src/routes/client';

import api from 'src/routes/api';
import { IStore } from 'src/store';
import { IContactHistory, IContactHistoryEvent } from 'src/entities/ContactHistory/store';

import {
    openContactHistoryAccount as openAccount,
    IOpenContactHistoryAccountParams as IOpenAccountParams
} from 'src/entities/ContactHistory/actions';
import { getAccountsFromEvents, IGetAccountsFromEventsRequestParams } from 'src/entities/ContactHistory/actions';

interface IProps {
    contactHistory: IContactHistory;
    loaders?: {
        getAccountsFromEvents: boolean;
    };
}

interface IActions {
    actions: {
        openAccount: (params: IOpenAccountParams) => void;
        getAccountsFromEvents: (params: IGetAccountsFromEventsRequestParams) => void;
    };
}

type TProps = IProps & IActions & RouteComponentProps<any>;

class ContactHistory extends React.PureComponent<TProps, any> {
    contactRef: React.RefObject<Input<any>> = React.createRef();

    onGetContactHistoryClick = (event) => {
        let contact = this.contactRef.current.getValue();
        let contactType = 'login';
        contact = contact && contact.trim();

        if (contact && contact.length) {
            if (/@/.test(contact)) {
                contactType = 'email';
            } else if (/^\+?\d+$/.test(contact)) {
                contactType = 'phone';
            }

            this.props.actions.getAccountsFromEvents({
                value: contact,
                contactType,
                from: 0,
                count: 100
            });
        }

        event.preventDefault();
    };

    onAccountClick = (event: IContactHistoryEvent) => {
        this.props.actions.openAccount({ account: event.account });
        this.props.history.push(getRoute('contactHistoryAccount', { id: event.account.id }));
    };

    get contactHistory() {
        const { searchResult: items } = this.props.contactHistory;
        const hasHistory = items && items.length > 0;
        const noData = items && items.length === 0;

        if (hasHistory) {
            return (
                <Table
                    locator="history"
                    onRawClick={this.onAccountClick}
                    className="mt-m"
                    data={items as any}
                    columns={[
                        { text: 'ID', field: 'userId' },
                        { text: 'Дата привязки', field: 'addedDate' },
                        { text: 'Дата отвязки', field: 'deletedDate' },
                        { text: 'Профиль', field: 'account', collapsible: true, format: 'json' }
                    ]}
                />
            );
        } else if (noData) {
            return (
                <div className="mt-m">Нет данных</div>
            );
        }

        return null;
    }

    render() {
        const { loaders } = this.props;
        const { contactHistory } = this;

        return (<>
            <Title>Поиск по истории изменения контакта</Title>
            <Inner className="mt-xl pb-xxl ml-xl">
                <Form>
                    <Row className="align-items-flex-end">
                        <Input
                            locator="history-identity"
                            ref={this.contactRef}
                            className="col-6"
                            label="Логин, почта, телефон"
                            placeholder="Укажи контакт для поиска истории"
                            theme="light"
                        />
                        <Button
                            locator="history-search-button"
                            isLoading={loaders.getAccountsFromEvents}
                            onClick={this.onGetContactHistoryClick}
                            className="ml-m col-3"
                            mods={['size-medium', 'font-size-medium']}
                            type="submit"
                        >
                            Найти
                        </Button>
                    </Row>
                </Form>
                {contactHistory}
                <Error
                    showDetails
                    className="text-align-left mt-m"
                    route={api.events.getAccountsFromEvents}
                />
                <Error
                    showDetails
                    className="text-align-left mt-m"
                    route={api.accounts.getAccountsByIds}
                />
            </Inner>
        </>);
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    contactHistory: state.contactHistory
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getAccountsFromEvents,
        openAccount
    }, dispatch)
});

const ContactHistoryWithConnect = withRouter(connect(mapStateToProps, mapDispatchToProps)(ContactHistory));

export default () => (
    <RequestTracker loaders={[
        api.events.getAccountsFromEvents
    ]}>
        <ContactHistoryWithConnect />
    </RequestTracker>
);
