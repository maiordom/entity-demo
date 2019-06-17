import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface ICancelPaymentRequestParams {
    paymentId: string;
    amount: string;
    reason: IReason;
}

export const cancelPayment = (params: ICancelPaymentRequestParams) =>
    request.call(routes.billing.cancelPayment, params);

export default cancelPayment;
