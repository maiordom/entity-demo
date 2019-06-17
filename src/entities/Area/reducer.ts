import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetAreaAction
} from './actions';

export default handleActions({
    [a.setArea.name]: (state: IStore, { payload: { area } }: ISetAreaAction) => {
        state.area.selected = area;
        state.area = {...state.area};
        return state;
    }
}, {});
