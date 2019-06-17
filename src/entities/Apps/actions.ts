import each from 'lodash/each';

import { getApps as getAppSerives } from './services/GetApps';

import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IApps, IOption } from './store';

export interface ISetAppsParams { apps: IApps; }
export interface ISetAppsAction extends IAction<ISetAppsParams> {}

export interface ISelectAppParams { app: IOption; }
export interface ISelectAppAction extends IAction<ISelectAppParams> {}

export const {
    setApps,
    selectApp
} = {
    setApps: (params: ISetAppsParams) => createAction('setApps', params),
    selectApp: (params: ISelectAppParams) => createAction('selectApp', params)
};

export const getApps = () => (dispatch) =>
    getAppSerives().then((res) => {
        dispatch(setApps({ apps: res }));
    });