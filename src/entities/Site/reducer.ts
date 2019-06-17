import { handleActions } from 'redux-actions';
import { IAction } from 'src/types/IAction';

import { IStore } from 'src/store';

import * as a from './actions';

export default handleActions({
    [a.setProperty.name]: (state: IStore, { payload: {
        paramName,
        paramValue
    } }: IAction<a.ISetPropertyParams>) => {
        state.site[paramName] = paramValue;
        return state;
    }
}, {});
