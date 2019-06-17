import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IGameShopItem } from '../models/GameShopItem';

export interface IGetGameShopItemsRequestParams {
    offset: number;
    count: number;
    toPartnerId: string;
}

export interface IGetGameShopItemsResponse {
    data: {
        total: number;
        items: Array<IGameShopItem>;
    };
}

export const getGameShopItems = (params: IGetGameShopItemsRequestParams) =>
    request.call(
        (routes.gameShop.getGameShopItems as TRouteHandler)(params)
    ).then(({ data: { data: { items, total } } }: AxiosResponse<IGetGameShopItemsResponse>) => ({
        items: items.map(item => ({
            id: item.id,
            name: {
                ru: item.name.ru,
                en: item.name.en,
                pt: item.name.pt
            },
            data: item.data,
            stackSize: item.stackSize,
            categoryId: item.categoryId
        })),
        total
    }));

export default getGameShopItems;
