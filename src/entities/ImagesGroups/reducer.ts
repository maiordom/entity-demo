import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetImagesGroupsAction,
} from './actions';

export default handleActions({
    [a.setImagesGroups.name]: (state: IStore, { payload: { groups } }: ISetImagesGroupsAction) => {
        state.imagesGroups = groups;
        return state;
    }
}, {});
