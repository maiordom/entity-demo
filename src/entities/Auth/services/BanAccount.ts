import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface IBanAccountRequestParams {
    userId: string;
    until: string;
    reason: IReason;
}

export const banAccount = ({ userId, reason, until }) =>
    request.call(
        (routes.auth.banAccount as TRouteHandler)({ userId }),
        { reason, until }
    );

export default banAccount;
