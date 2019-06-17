import { IShopItem } from 'src/entities/ShopItems/models/ShopItem';

import { IBrowserTab } from 'src/types/IBrowserTab';

export interface IShopItems {
    items: Array<IShopItem>;
    from: number;
    total: number;
    count: number;
    selectedItem: IShopItem;
    searchResult: Array<IShopItem>;
    browserTabs: Array<IBrowserTab>;
    selectedBrowserTab: IBrowserTab;
}

const DEFAULT_TAB: IBrowserTab = {
    id: null,
    title: 'Поиск товаров'
};

export const shopItems: IShopItems = {
    items: [],
    from: 0,
    total: 0,
    count: 10,
    selectedItem: null,
    searchResult: [],
    browserTabs: [ DEFAULT_TAB ],
    selectedBrowserTab: DEFAULT_TAB
};
