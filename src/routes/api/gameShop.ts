import qs from 'qs';

import { IGetGameShopItemsRequestParams } from 'src/entities/GameShop/services/GetGameShopItems';
import { IDeleteGameShopItemRequestParams } from 'src/entities/GameShop/services/DeleteGameShopItem';

export default {
    addGameShopItems: {
        url: '/api/pgw/game/shop/private/items/many/',
        method: 'POST'
    },
    getGameShopItems: (params: IGetGameShopItemsRequestParams) => ({
        url: `/api/pgw/game/shop/private/items/?${qs.stringify(params)}`,
        method: 'GET'
    }),
    cancelGameShopOrder: {
        url: '/api/pgw/game/shop/private/orders/cancel/',
        method: 'POST'
    },
    addGameShopItem: {
        url: '/api/pgw/game/shop/private/items/',
        method: 'POST'
    },
    editGameShopItem: {
        url: '/api/pgw/game/shop/private/items/',
        method: 'PUT'
    },
    deleteGameShopItem: ({ id }: IDeleteGameShopItemRequestParams) => ({
        url: `/api/pgw/game/shop/private/items/${id}/`,
        method: 'DELETE'
    })
};
