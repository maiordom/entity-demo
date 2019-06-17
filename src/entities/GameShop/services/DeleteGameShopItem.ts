import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteGameShopItemRequestParams {
    id: string;
    toPartnerId: string;
}

export const deleteGameShopItem = ({ id, toPartnerId }: IDeleteGameShopItemRequestParams) =>
    request.call(
        (routes.gameShop.deleteGameShopItem as TRouteHandler)({ id }),
        { toPartnerId }
    );

export default deleteGameShopItem;
