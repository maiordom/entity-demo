import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetAppsAction,
    ISelectAppAction
} from './actions';

export const filterApp = (app: string, area: string, areasKeys: Array<string>) => {
    const hasIntersectionWithSomeAreas = areasKeys.some(areaKey => app.indexOf(areaKey) !== -1);
    const hasIntersectionWithCurrentArea = app.indexOf(area) !== -1;

    return hasIntersectionWithCurrentArea || hasIntersectionWithSomeAreas;
};

export default handleActions({
    [a.setApps.name]: (state: IStore, { payload: { apps } }: ISetAppsAction) => {
        const currentArea = state.area.selected.id;
        const currentApp = state.appsOptions.selected;
        const areasKeys = state.area.items.map(item => item.id);

        state.apps = apps;
        state.appsOptions = {...state.appsOptions};
        state.appsOptions.items = Object.keys(apps)
            .filter(app => filterApp(app, state.area.selected.id, areasKeys))
            .map((app) => ({
                id: apps[app].id,
                value: apps[app].name
            }));

        if (String(currentApp.id).indexOf(currentArea) === -1) {
            currentApp.id = null;
            currentApp.value = null;
        }

        return state;
    },

    [a.selectApp.name]: (state: IStore, { payload: { app } }: ISelectAppAction) => {
        state.appsOptions = Object.assign({}, state.appsOptions);
        state.appsOptions.selected = app;
        return state;
    }
}, {});
