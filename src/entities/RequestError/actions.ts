import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IError } from './store';
import { IRequest } from 'src/entities/RequestJournal/store';

import { on as requestOnHandler } from 'src/utils/Request';

export interface ISetErrorParams { name: string; error: IError; }
export interface ISetErrorAction extends IAction<ISetErrorParams>{}

export interface IRemoveErrorParams { name: string; }
export interface IRemoveErrorAction extends IAction<IRemoveErrorParams> {}

export const {
    clearErrors,
    setError,
    removeError
} = {
    clearErrors: () => createAction('clearErrors'),
    setError: (params: ISetErrorParams) => createAction('setError', params),
    removeError: (params: IRemoveErrorParams) => createAction('removeError', params)
};

export const bindEvents = (dispatch) => {
    requestOnHandler('requestStart', (params: IRequest) => dispatch(removeError({
        name: params.name
    })));

    requestOnHandler('requestEnd', (params: IRequest) => {
        if (params.error) {
            dispatch(setError({
                name: params.name,
                error: params.error
            }));
        }
    });
};
