import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, withRouter, RouteComponentProps } from 'react-router';

import BrowserTabs from 'ui/lib/BrowserTabs';

import { Container } from 'src/components/Layout/Layout';
import LootBoxList from './LootBoxList';

import { selectBrowserTab, ISelectBrowserTabParams } from 'src/entities/BrowserTabs/actions';
import { closeBrowserTab, ICloseBrowserTabParams } from 'src/entities/BrowserTabs/actions';
import { setBrowserTab, ISetBrowserTabParams } from 'src/entities/BrowserTabs/actions';
import clientRoutes, { getRoute } from 'src/routes/client';

import { IBrowserTabsItem } from 'src/entities/BrowserTabs/store';
import { IStore } from 'src/store';

type TTableConfigKey = (lang: string) => string | string;

export interface IOwnProps {
    shortServiceId: string;
    serviceId: string;
    projectName: string;
    routes: {
        [key: string]: string;
    };
    tableConfig?: {
        keys: {
            [key: string]: Array<TTableConfigKey> | TTableConfigKey;
        };
    };
    restrictions?: {
        maxComponents: number;
    };
}

export interface IProps {
    lang: string;
    browserTabs: IBrowserTabsItem;
}

export interface IActions {
    actions: {
        setBrowserTab: (params: ISetBrowserTabParams) => void;
        selectBrowserTab: (params: ISelectBrowserTabParams) => void;
        closeBrowserTab: (params: ICloseBrowserTabParams) => void;
    };
}

import LootBoxViewer from './LootBoxViewer';

type TProps = IOwnProps & IProps & IActions & RouteComponentProps<any>;

class LootBox extends React.Component<TProps> {
    onBrowserTabClick = (id: number) => {
        this.props.actions.selectBrowserTab({ id, projectName: this.props.routes.list });

        if (id === null) {
            this.props.history.push(clientRoutes[this.props.routes.list]);
        } else {
            this.props.history.push(getRoute(this.props.routes.item, { id }));
        }
    };

    onBrowserTabClose = (id: number) => {
        if (id === null) {
            return;
        }

        if (id !== null) {
            this.props.history.push(clientRoutes[this.props.routes.list]);
        }

        this.props.actions.closeBrowserTab({ id, projectName: this.props.projectName });
    };

    render() {
        const { browserTabs, tableConfig, restrictions } = this.props;

        return (
            <Container>
                <div className="browser-tabs">
                    <BrowserTabs
                        onClick={this.onBrowserTabClick}
                        onClose={this.onBrowserTabClose}
                        theme="admin"
                        items={browserTabs.items}
                        selected={browserTabs.selected}
                    />
                </div>
                <Route
                    exact
                    path={clientRoutes[this.props.routes.item]}
                    render={(props: RouteComponentProps<{ id?: string }>) => (
                        <LootBoxViewer
                            id={props.match.params.id}
                            key={props.match.params.id}
                            projectName={this.props.projectName}
                            serviceId={this.props.serviceId}
                            routes={this.props.routes}
                            tableConfig={tableConfig}
                            restrictions={restrictions}
                            shortServiceId={this.props.shortServiceId}
                        />
                    )}
                />
                <Route
                    exact
                    path={clientRoutes[this.props.routes.list]}
                    render={() => (
                        <LootBoxList
                            serviceId={this.props.serviceId}
                            projectName={this.props.projectName}
                            routes={this.props.routes}
                            shortServiceId={this.props.shortServiceId}
                        />
                    )}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => ({
    lang: state.area.selected.lang,
    browserTabs: state.browserTabs[ownProps.projectName]
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        ...bindActionCreators({
            setBrowserTab,
            selectBrowserTab,
            closeBrowserTab
        }, dispatch)
    }
});

export default withRouter<IOwnProps & RouteComponentProps<any>>(connect(mapStateToProps, mapDispatchToProps)(LootBox));
