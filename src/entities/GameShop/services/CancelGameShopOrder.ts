import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface ICancelGameShopOrderRequestParams {
    orderId: string;
    reason: IReason;
    toPartnerId: string;
}

export const cancelGameShopOrder = (params: ICancelGameShopOrderRequestParams) =>
    request.call(routes.gameShop.cancelGameShopOrder, params);

export default cancelGameShopOrder;
