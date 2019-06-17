import { handleActions } from 'redux-actions';
import find from 'lodash/find';
import reject from 'lodash/reject';

import { IAction } from 'src/types/IAction';
import { IStore } from 'src/store';

import * as a from './actions';

export default handleActions({
    [a.setShopItems.name]: (state: IStore, { payload: { items, from, total } }: IAction<a.ISetShopItemsParams>) => {
        state.shopItems = { ...state.shopItems };
        state.shopItems.searchResult = [ ...items ];
        state.shopItems.from = from || 0;
        state.shopItems.total = total || 0;
    
        return state;
    },

    [a.closeShopBrowserTab.name]: (state: IStore, { payload: { id } }: IAction<a.ICloseShopBrowserTabParams>) => {
        state.shopItems = {...state.shopItems};

        if (id === state.shopItems.selectedBrowserTab.id) {
            state.shopItems.selectedBrowserTab = state.shopItems.browserTabs[0];
            state.shopItems.selectedItem = state.shopItems.items[0];
        }

        state.shopItems.browserTabs = reject(state.shopItems.browserTabs, { id });
        state.shopItems.items = reject(state.shopItems.items, { id });

        return state;
    },

    [a.setShopBrowserTab.name]: (state: IStore, { payload: { id } }: IAction<a.ISetShopBrowserTabParams>) => {
        state.shopItems = {...state.shopItems};

        const currentShopItem = find(state.shopItems.items, { id });
        const currentBrowserTab = find(state.shopItems.browserTabs, { id });

        state.shopItems.selectedBrowserTab = currentBrowserTab;
        state.shopItems.selectedItem = currentShopItem;

        return state;
    },

    [a.clearShopItems.name]: (state: IStore) => {
        state.shopItems = {...state.shopItems};

        state.shopItems.searchResult = [];

        return state;
    },

    [a.openShopItem.name]: (state: IStore, { payload: { shopItem } }: IAction<a.IOpenShopItemParams>) => {
        state.shopItems = {...state.shopItems};

        const currentShopItem = find(state.shopItems.items, { id: shopItem.id });
        const currentBrowserTab = find(state.shopItems.browserTabs, { id: Number(shopItem.id) });

        if (currentBrowserTab) {
            state.shopItems.selectedBrowserTab = currentBrowserTab;
        } else {
            const browserTab = {
                id: Number(shopItem.id),
                title: shopItem.name[state.area.selected.lang],
                type: 'shopItem'
            };
            state.shopItems.browserTabs.push(browserTab);
            state.shopItems.selectedBrowserTab = browserTab;
        }

        if (currentShopItem) {
            state.shopItems.selectedItem = shopItem;
        } else {
            state.shopItems.items.push(shopItem);
            state.shopItems.selectedItem = shopItem;
        }

        return state;
    }
}, {});
