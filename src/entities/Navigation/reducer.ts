import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import { IRoute } from 'src/entities/Navigation/store';

import {
    IToggleRouteAction,
    IMatchToPathAction
} from './actions';

const traverseRoute = (callback: (route: IRoute) => void, route: IRoute) => {
    callback(route);

    route.routes && route.routes.forEach(item => {
        traverseRoute(callback, item);
    });
};

export default handleActions({
    [a.toggleRoute.name]: (state: IStore, { payload: { route } }: IToggleRouteAction) => {
        state.navigation = [...state.navigation];

        const { link } = route;

        traverseRoute((route) => {
            route.isActive = link.indexOf(route.link) === 0;
        }, state.navigation[0]);

        return state;
    },

    [a.matchToPath.name]: (state: IStore, { payload: { path } }: IMatchToPathAction) => {
        state.navigation = [...state.navigation];
        traverseRoute((route) => {
            route.isActive = path.indexOf(route.link) === 0;
        }, state.navigation[0]);

        return state;
    }
}, {});