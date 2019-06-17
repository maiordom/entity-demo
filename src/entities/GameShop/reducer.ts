import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetGameShopItemsAction
} from './actions';

export default handleActions({
    [a.setGameShopItems.name]: (state: IStore, { payload: { total, page, serviceId, items } }: ISetGameShopItemsAction) => {
        state.gameShop.items[serviceId] = { total, items };
        state.gameShop.pagination.page = page;

        return state;
    }
}, {});
