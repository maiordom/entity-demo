import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface IUnbanAccountRequestParams {
    userId: string;
    reason: IReason;
}

export const unbanAccount = ({ userId, reason }) =>
    request.call(
        (routes.auth.unbanAccount as TRouteHandler)({ userId }),
        { reason }
    );

export default unbanAccount;
