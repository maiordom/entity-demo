import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { on as requestOnHandler } from 'src/utils/Request';

import { IRequest } from './store';

export interface ISetRequestParams extends IRequest {}
export interface ISetRequestAction extends IAction<ISetRequestParams> {}

export interface IRemoveRequestParams extends IRequest {}
export interface IRemoveRequestAction extends IAction<IRemoveRequestParams> {}

export const {
    setRequest,
    removeRequest
} = {
    setRequest: (params: ISetRequestParams) => createAction('setRequest', params),
    removeRequest: (params: IRemoveRequestParams) => createAction('removeRequest', params)
};

export const bindEvents = (dispatch) => {
    requestOnHandler('requestStart', (params: ISetRequestParams) => {
        dispatch(setRequest(params));
    });

    requestOnHandler('requestEnd', (params: IRemoveRequestParams) => {
        dispatch(removeRequest(params));
    });
};
