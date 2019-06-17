import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IGameShopItem } from '../models/GameShopItem';

export interface IAddGameShopItemRequestParams {
    item: IGameShopItem;
    toPartnerId: string;
}

export const addGameShopItem = (params: IAddGameShopItemRequestParams) =>
    request.call(routes.gameShop.addGameShopItem, params);

export default addGameShopItem;
