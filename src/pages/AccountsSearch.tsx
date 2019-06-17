import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Title, Inner } from 'src/components/Layout/Layout';
import { Form, Row, Error } from 'src/components/Form/Form';
import Table from 'src/components/Table/Table';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import { clearAccounts } from 'src/entities/Accounts/actions';
import { getAccounts, IGetAccountsRequestParams, IGetAccountsResult } from 'src/entities/Accounts/actions';
import { openAccount, IOpenAccountParams } from 'src/entities/Accounts/actions';
import { setAccounts, ISetAccountsParams } from 'src/entities/Accounts/actions';

import {
    setAccountBrowserTab as setBrowserTab,
    ISetAccountBrowserTabParams as ISetBrowserTabParams
} from 'src/entities/Accounts/actions';

import {
    getAccountsByGameAccountParams,
    IGetGameAccountsByQueryRequestParams
} from 'src/entities/GameAuth/actions';

import { getRoute } from 'src/routes/client';
import api from 'src/routes/api';
import { IStore } from 'src/store';
import { IAccounts } from 'src/entities/Accounts/store';
import { IAccount } from 'src/entities/Accounts/models/Account';

interface IProps {
    accounts: IAccounts;
    loaders: {
        getAccounts: boolean;
    };
}

interface IActions {
    actions: {
        clearAccounts: () => void;
        getAccountsByGameAccountParams: (params: IGetGameAccountsByQueryRequestParams) => Promise<void>;
        getAccounts: (params: IGetAccountsRequestParams) => Promise<IGetAccountsResult>;
        openAccount: (params: IOpenAccountParams) => void;
        setBrowserTab: (params: ISetBrowserTabParams) => void;
        setAccounts: (params: ISetAccountsParams) => void;
    };
}

interface IState {
    loaders: {
        getAccounts: boolean;
    };
}

type TProps = IProps & IActions & RouteComponentProps<{ id: string }>;

class AccountsPage extends React.PureComponent<TProps, IState> {
    state = {
        loaders: { getAccounts: false }
    };
    contactRef: React.RefObject<Input<any>> = React.createRef();

    constructor(props: TProps) {
        super(props);

        this.props.actions.setBrowserTab({ id: null });
    }

    onGetAccountsClick = (event) => {
        let contact = this.contactRef.current.getValue();
        contact = contact && contact.trim();

        if (contact && contact.length) {
            this.getAccounts(contact);
        }

        event.preventDefault();
    };

    getAccounts = (contact: string) => {
        this.props.actions.clearAccounts();
        this.setState({ loaders: { getAccounts: true } });

        Promise.all([
            this.props.actions.getAccounts({ contact }).then(({ accounts }) => {
                this.props.actions.setAccounts({ accounts });
            }),
            /^\d+$/.test(contact) && this.props.actions.getAccountsByGameAccountParams({ id: Number(contact) }),
            this.props.actions.getAccountsByGameAccountParams({ login: contact })
        ]).then(() => {
            this.setState({ loaders: { getAccounts: false } });
        });
    }

    onAccountClick = (account: IAccount) => {
        this.props.actions.openAccount({ account });
        this.props.history.push(getRoute('account', { id: account.id }));
    };

    get accounts() {
        const { searchResult: items } = this.props.accounts;
        const hasAccounts = items.length;

        if (hasAccounts) {
            return (
                <Table
                    locator="accounts-results"
                    onRawClick={this.onAccountClick}
                    className="mt-m"
                    data={items as any}
                    columns={[
                        { text: 'ID', field: 'id' },
                        { text: 'Логин', field: 'username' },
                        { text: 'Почта', field: 'email' },
                        { text: 'Телефон', field: 'phone' },
                        { text: 'Бан до', field: 'ban.until' },
                        { text: 'Контекст', getValue: (account) => account.extraInfo || null }
                    ]}
                />
            );
        }

        return null;
    }

    render() {
        const { loaders } = this.state;

        return (<>
            <Title>Аккаунты</Title>
            <Inner className="mt-xl pb-xxl ml-xl">
                <Form locator="account-search">
                    <Row className="align-items-flex-end">
                        <Input
                            locator="account-search-input"
                            ref={this.contactRef}
                            className="col-6"
                            label="Логин, почта, телефон или id"
                            placeholder="Укажи контакт для поиска"
                            theme="light"
                        />
                        <Button
                            locator="account-search-button"
                            isLoading={loaders.getAccounts}
                            onClick={this.onGetAccountsClick}
                            className="ml-m col-3"
                            mods={['size-medium', 'font-size-medium']}
                            type="submit"
                        >
                            Найти
                        </Button>
                    </Row>
                </Form>
                {this.accounts}
                <Error
                    showDetails
                    className="text-align-left mt-m"
                    route={api.accounts.getAccounts}
                />
                <Error
                    showDetails
                    className="text-align-left mt-m"
                    route={api.gameAuth.getGameAccountsByQuery}
                />
            </Inner>
        </>);
    }
}

const mapStateToProps = (state: IStore) => ({
    accounts: state.accounts
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        setAccounts,
        clearAccounts,
        getAccounts,
        openAccount,
        setBrowserTab,
        getAccountsByGameAccountParams
    }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountsPage));
