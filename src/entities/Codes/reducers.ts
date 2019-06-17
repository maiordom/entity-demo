import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetEmissionsAction
} from './actions';

export default handleActions({
    [a.setEmissions.name]: (state: IStore, { payload: { total, from, serviceId, emissions } }: ISetEmissionsAction) => {
        const codes = { emissions, from, total };

        state.codes.items[serviceId] = codes;

        return state;
    }
}, {});
