import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router';

import clientRoutes, { getRoute } from 'src/routes/client';

import {
    setAccountBrowserTab as setBrowserTab,
    ISetAccountBrowserTabParams as ISetBrowserTabParams
} from 'src/entities/Accounts/actions';

import {
    closeAccountBrowserTab as closeBrowserTab,
    ICloseAccountBrowserTabParams as ICloseBrowserTabParams
} from 'src/entities/Accounts/actions';

import { IStore } from 'src/store';
import { IAccounts } from 'src/entities/Accounts/store';

import BrowserTabs from 'ui/lib/BrowserTabs';
import { Container, Scrollable } from 'src/components/Layout/Layout';
import Account from 'src/pages/Account/Account';
import AccountsSearch from 'src/pages/AccountsSearch';

interface IProps {
    accounts: IAccounts;
}

interface IActions {
    actions: {
        setBrowserTab: (params: ISetBrowserTabParams) => void;
        closeBrowserTab: (params: ICloseBrowserTabParams) => void;
    };
}

type TProps = IProps & IActions & RouteComponentProps<{ id: string }>;

class AccountsPage extends React.PureComponent<TProps, any> {
    componentWillMount() {
        this.props.actions.setBrowserTab({ id: null });
    }

    onBrowserTabClick = (id: number) => {
        this.props.actions.setBrowserTab({ id });

        if (id === null) {
            this.props.history.push(clientRoutes.accounts);
        } else {
            this.props.history.push(getRoute('account', { id }));
        }
    };

    onBrowserTabClose = (id: number) => {
        if (id === null) {
            return;
        }

        if (id !== null) {
            this.props.history.push(clientRoutes.accounts);
        }

        this.props.actions.closeBrowserTab({ id });
    };

    render() {
        const { accounts } = this.props;

        return (
            <Container hasVerticalScroll>
                <div className="browser-tabs">
                    <BrowserTabs
                        onClick={this.onBrowserTabClick}
                        onClose={this.onBrowserTabClose}
                        theme="admin"
                        items={accounts.browserTabs}
                        selected={accounts.selectedBrowserTab}
                    />
                </div>
                <Scrollable>
                    <Route exact path={clientRoutes.account} render={(props: RouteComponentProps<{ id: string }>) => (
                        <Account
                            id={props.match.params.id}
                            key={props.match.params.id}
                        />
                    )} />
                    <Route exact path={clientRoutes.accounts} render={() => (
                        <AccountsSearch />
                    )} />
                </Scrollable>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    accounts: state.accounts
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        setBrowserTab,
        closeBrowserTab
    }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountsPage));
