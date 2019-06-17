import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router';

import { Container } from 'src/components/Layout/Layout';

import BrowserTabs from 'ui/lib/BrowserTabs';
import AccountHistory from 'src/pages/Account/AccountHistory';

import { IStore } from 'src/store';
import { IContactHistory } from 'src/entities/ContactHistory/store';
import clientRoutes, { getRoute } from 'src/routes/client';

import { setContactHistoryBrowserTab, ISetContactHistoryBrowserTabParams } from 'src/entities/ContactHistory/actions';
import { closeContactHistoryBrowserTab, ICloseContactHistoryBrowserTabParams } from 'src/entities/ContactHistory/actions';

import ContacHistorySearch from './ContactHistorySearch';

interface IProps {
    contactHistory: IContactHistory;
}

interface IActions {
    actions: {
        setBrowserTab: (params: ISetContactHistoryBrowserTabParams) => void;
        closeBrowserTab: (params: ICloseContactHistoryBrowserTabParams) => void;
    };
}

type TProps = IProps & IActions & RouteComponentProps<any>;

class ContactHistory extends React.PureComponent<TProps, any> {
    componentWillMount() {
        this.props.actions.setBrowserTab({ id: null });
    }

    onBrowserTabClick = (id: number) => {
        this.props.actions.setBrowserTab({ id });

        if (id === null) {
            this.props.history.push(clientRoutes.contactHistory);
        } else {
            this.props.history.push(getRoute('contactHistoryAccount', { id }));
        }
    };

    onBrowserTabClose = (id: number) => {
        if (id === null) {
            return;
        }

        if (id !== null) {
            this.props.history.push(clientRoutes.contactHistory);
        }

        this.props.actions.closeBrowserTab({ id });
    };

    render() {
        const { contactHistory } = this.props;

        return (
            <Container>
                <div className="browser-tabs">
                    <BrowserTabs
                        onClick={this.onBrowserTabClick}
                        onClose={this.onBrowserTabClose}
                        theme="admin"
                        items={contactHistory.browserTabs}
                        selected={contactHistory.selectedBrowserTab}
                    />
                </div>
                <Route
                    exact
                    path={clientRoutes.contactHistoryAccount}
                    render={(props: RouteComponentProps<{ id: string }>) => (
                        <AccountHistory
                            id={props.match.params.id}
                            key={props.match.params.id}
                        />
                    )}
                />
                <Route
                    exact
                    path={clientRoutes.contactHistory}
                    render={() => (
                        <ContacHistorySearch />
                    )}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    contactHistory: state.contactHistory
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        setBrowserTab: setContactHistoryBrowserTab,
        closeBrowserTab: closeContactHistoryBrowserTab
    }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContactHistory));
