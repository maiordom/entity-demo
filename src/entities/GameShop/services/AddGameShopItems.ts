import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IGameShopItem } from '../models/GameShopItem';

export interface IAddGameShopItemsRequestParams {
    items: Array<IGameShopItem>;
    toPartnerId: string;
}

export const addGameShopItems = (params: IAddGameShopItemsRequestParams) =>
    request.call(routes.gameShop.addGameShopItems, params);

export default addGameShopItems;
