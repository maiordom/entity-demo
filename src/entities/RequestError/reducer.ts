import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetErrorAction,
    IRemoveErrorAction
} from './actions';

export default handleActions({
    [a.setError.name]: (state: IStore, { payload: { name, error } }: ISetErrorAction) => {
        state.requestErrors = {...state.requestErrors};
        state.requestErrors[name] = error;
        return state;
    },

    [a.removeError.name]: (state: IStore, { payload: { name } }: IRemoveErrorAction) => {
        state.requestErrors = {...state.requestErrors};
        delete state.requestErrors[name];
        return state;
    },

    [a.clearErrors.name]: (state: IStore) => {
        state.requestErrors = {};

        return state;
    }
}, {});
