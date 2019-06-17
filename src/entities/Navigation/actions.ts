import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IRoute } from './store';

export interface IToggleRouteParams { route: IRoute; }
export interface IToggleRouteAction extends IAction<IToggleRouteParams> {}

export interface IMatchToPathParams { path: string; }
export interface IMatchToPathAction extends IAction<IMatchToPathParams> {}

export const {
    toggleRoute,
    matchToPath
} = {
    toggleRoute: (params: IToggleRouteParams) => createAction('toggleRoute', params),
    matchToPath: (params: IMatchToPathParams) => createAction('matchToPath', params)
};
