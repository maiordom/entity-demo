import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetPaginationAction,
} from './actions';

export default handleActions({
    [a.setPagination.name]: (state: IStore, { payload: { option } }: ISetPaginationAction) => {
        state.pagination.perPageCountOptions.selected = option;
        return state;
    }
}, {});
