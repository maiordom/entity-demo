import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface ICancelWebshopOrderRequestParams {
    orderId: string;
    reason: IReason;
    force?: boolean;
}

export const cancelWebshopOrder = (params: ICancelWebshopOrderRequestParams) =>
    request.call(routes.webshop.cancelOrder, params);

export default cancelWebshopOrder;
