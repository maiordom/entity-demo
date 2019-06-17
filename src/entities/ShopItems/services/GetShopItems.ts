import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { IPagination } from 'src/types/IPagination'
import { IShopItem } from 'src/entities/ShopItems/models/ShopItem';

export type IGetShopItemsRequestParams = {
    serviceId: string;
    name?: string;
    from?: number;
    count: number;
    categoryId?: number;
};

interface IGetShopItemsResponse {
    data: IPagination<{
        main: IShopItem;
        versions: Array<IShopItem>;
    }>;
}

export interface IGetShopItemsResult extends IPagination<IShopItem> {}

export const getShopItems = (params: IGetShopItemsRequestParams): Promise<IGetShopItemsResult> =>
    request.call(
        (routes.webshop.getShopItems as TRouteHandler)(params)
    ).then(({ data: { data }}: AxiosResponse<IGetShopItemsResponse>) => ({
        items: (data.items || []).map((item) => ({
            ...item.main,
            versions: item.versions
        })),
        from: data.from,
        total: data.total
    })).catch(() => ({
        items: [],
        from: 0,
        total: 0
    }))

export default getShopItems;
