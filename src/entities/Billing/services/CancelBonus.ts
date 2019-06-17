import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface ICancelBonusRequestParams {
    bonusId: string;
    amount: string;
    reason: IReason;
}

export const cancelBonus = (params: ICancelBonusRequestParams) =>
    request.call(routes.billing.cancelBonus, params);

export default cancelBonus;
