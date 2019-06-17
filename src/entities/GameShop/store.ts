import { IGameShopItem } from './models/GameShopItem';

export interface IGameShopItems {
    items: Array<IGameShopItem>;
    total: number;
}

export interface IPagination {
    count: number;
    page: number;
}

export interface IGameShop {
    items: {
        [key: string]: IGameShopItems;
    };
    pagination: IPagination;
}

export const gameShop: IGameShop = {
    items: {},
    pagination: { count: 100, page: 0 }
};
