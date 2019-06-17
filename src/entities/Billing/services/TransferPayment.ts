import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface ITransferPaymentParams {
    paymentId: string;
    receiverUserId: string;
    reason: IReason;
}

export const transferPayment = (params: ITransferPaymentParams) =>
    request.call(routes.billing.transferPayment, params);

export default transferPayment;
