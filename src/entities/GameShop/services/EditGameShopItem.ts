import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IGameShopItem } from '../models/GameShopItem';

export interface IEditGameShopItemRequestParams {
    item: IGameShopItem;
    toPartnerId: string;
}

export const editGameShopItem = (params: IEditGameShopItemRequestParams) =>
    request.call(routes.gameShop.editGameShopItem, params);

export default editGameShopItem;
