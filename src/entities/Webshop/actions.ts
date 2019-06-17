import cancelWebshopOrderService, { ICancelWebshopOrderRequestParams } from './services/CancelWebshopOrder';
export { ICancelWebshopOrderRequestParams } from './services/CancelWebshopOrder';

export const cancelWebshopOrder = (params: ICancelWebshopOrderRequestParams) => () =>
    cancelWebshopOrderService(params);
