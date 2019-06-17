import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetRequestAction,
    IRemoveRequestAction
} from './actions';

export default handleActions({
    [a.setRequest.name]: (state: IStore, { payload: { name, data, params } }: ISetRequestAction) => {
        state.requestJournal = {...state.requestJournal};
        state.requestJournal[name] = { name, data, params };
        return state;
    },

    [a.removeRequest.name]: (state: IStore, { payload: { name } }: IRemoveRequestAction) => {
        delete state.requestJournal[name];
        state.requestJournal = {...state.requestJournal};
        return state;
    }
}, {});
