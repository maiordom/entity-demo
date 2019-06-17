import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import find from 'lodash/find';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { getProfile } from 'src/entities/User/actions';
import { getApps } from 'src/entities/Apps/actions';
import { getImagesGroups } from 'src/entities/ImagesGroups/actions';

import clientRoutes from 'src/routes/client';
import Router from 'src/components/Router/Router';
import {
    Page,
    SideBar,
    Userbar as UserbarLayout,
    Area as AreaLayout
} from 'src/components/Layout/Layout';
import Userbar from 'src/components/Userbar/Userbar';
import Area from 'src/components/Area/Area';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

import WebshopPage from 'src/pages/Webshop/Webshop';
import UsersGroupsPage from 'src/pages/UsersGroups';
import ContentPagesPage from 'src/pages/ContentPages';
import ContentPage from 'src/pages/ContentPage';
import Codes from 'src/pages/Codes/Codes';
import CreateCodes from 'src/pages/CreateCodes';
import Roles from 'src/pages/Roles/Roles';
import Claims from 'src/pages/Claims/Claims';
import RolesManager from 'src/pages/RolesManager/RolesManager';
import Accounts from 'src/pages/Accounts';
import Documents from 'src/pages/Documents/Documents';
import ContactHistory from 'src/pages/ContactHistory';
import MassBan from 'src/pages/MassBan';
import MassSubscription from 'src/pages/MassSubscription';
import GameShopItems from 'src/pages/GameShopItems/GameShopItems';
import StatusMonitor from 'src/pages/StatusMonitor/StatusMonitor';
import WebshopCategories from 'src/pages/WebshopCategories/WebshopCategories';
import PromoCodeActivations from 'src/pages/PromoCodeActivations';
import Transactions from 'src/pages/Transactions/Transactions';
import Wheel from 'src/pages/LootBox/LootBox';

import api from 'src/routes/api';
import ProductDescriptions from './ProductDescriptions/ProductDescriptions';

interface IActions {
    actions: {
        getProfile: () => Promise<void>;
        getApps: () => Promise<void>;
        getImagesGroups: () => Promise<void>;
    }
}

type TProps = IActions & RouteComponentProps<any>;

class IndexPage extends React.Component<TProps, any> {
    constructor(props: TProps) {
        super(props);

        this.pathname = this.props.location.pathname;
        this.locationKey = this.props.location.key;
    }

    componentDidMount() {
        this.props.actions.getProfile();
        this.props.actions.getApps();
        this.props.actions.getImagesGroups();
    }

    pathname: string = null;
    locationKey: string = null;

    transitionStoppers = [
        clientRoutes.accounts,
        clientRoutes.contactHistory,
        clientRoutes.aionLootBoxes,
        clientRoutes.pbLootBoxes
    ];

    componentWillReceiveProps(nextProps: TProps) {
        const { pathname, key } = nextProps.location;
        const transitionStopper = find(this.transitionStoppers, (stopper) => this.pathname.indexOf(stopper) >= 0);
        const nextTransitionStopper = find(this.transitionStoppers, (stopper) => pathname.indexOf(stopper) >= 0);

        if (
            transitionStopper &&
            nextTransitionStopper &&
            transitionStopper === nextTransitionStopper
        ) {
            return null;
        } else {
            this.pathname = pathname;
            this.locationKey = key;
        }
    }

    render() {
        const { location } = this.props;
        const { locationKey } = this;

        return (
            <Page>
                <SideBar>
                    <UserbarLayout>
                        <Userbar />
                    </UserbarLayout>
                    <Router />
                    <AreaLayout>
                        <Area />
                    </AreaLayout>
                </SideBar>
                <TransitionGroup component={null}>
                    <CSSTransition
                        key={locationKey}
                        classNames="fade"
                        timeout={{ enter: 600, exit: 300 }}
                    >
                        <Switch location={location}>
                            <Route exact path={clientRoutes.webshop} component={WebshopPage} />
                            <Route exact path={clientRoutes.webshopCategories} component={WebshopCategories} />
                            <Route exact path={clientRoutes.content} component={ContentPagesPage} />
                            <Route exact path={clientRoutes.codes} component={Codes} />
                            <Route exact path={clientRoutes.createCodes} component={CreateCodes} />
                            <Route exact path={clientRoutes.newPage} component={ContentPage} />
                            <Route exact path={clientRoutes.administration} component={Roles} />
                            <Route exact path={clientRoutes.claims} component={Claims} />
                            <Route exact path={clientRoutes.roles} component={RolesManager} />
                            <Route path={clientRoutes.accounts} component={Accounts} />
                            <Route exact path={clientRoutes.documents} component={Documents} />
                            <Route exact path={clientRoutes.productDescriptions} component={ProductDescriptions} />
                            <Route path={clientRoutes.contactHistory} component={ContactHistory} />
                            <Route exact path={clientRoutes.massBan} component={MassBan} />
                            <Route exact path={clientRoutes.massSubscription} component={MassSubscription} />
                            <Route exact path={clientRoutes.gameShopItems} component={GameShopItems} />
                            <Route exact path={clientRoutes.statusMonitor} component={StatusMonitor} />
                            <Route exact path={clientRoutes.codeActivations} component={PromoCodeActivations} />
                            <Route exact path={clientRoutes.transactions} component={Transactions} />
                            <Route path={clientRoutes.aionLootBoxes} render={() => (
                                <Wheel
                                    shortServiceId="aion"
                                    serviceId="aion-ru"
                                    projectName="aionLootBoxes"
                                    routes={{
                                        item: 'aionLootBox',
                                        list: 'aionLootBoxes'
                                    }}
                                    tableConfig={{
                                        keys: {
                                            name: [
                                                (lang: string) => `name.name.${lang}`
                                            ]
                                        }
                                    }}
                                    restrictions={{
                                        maxComponents: 16
                                    }}
                                />
                            )} />
                            <Route path={clientRoutes.pbLootBoxes} render={() => (
                                <Wheel
                                    shortServiceId="pointBlank"
                                    serviceId="pb-ru"
                                    projectName="pbLootBoxes"
                                    routes={{
                                        item: 'pbLootBox',
                                        list: 'pbLootBoxes'
                                    }}
                                    tableConfig={{
                                        keys: {
                                            name: [
                                                (lang: string) => `name.mainName.${lang}`,
                                                (lang: string) => `name.name.${lang}`
                                            ]
                                        }
                                    }}
                                />
                            )} />
                            <Route exact path={clientRoutes.editPage} render={() =>
                                React.createElement(ContentPage, { type: 'edit' } as any)
                            } />
                            <Route exact path={clientRoutes.userGroups} render={() =>
                                <RequestTracker loaders={[ api.groupManager.getUsersGroups ]}>
                                    <UsersGroupsPage />
                                </RequestTracker>
                            } />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </Page>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getProfile,
        getApps,
        getImagesGroups
    }, dispatch)
});

export default connect(null, mapDispatchToProps)(IndexPage);