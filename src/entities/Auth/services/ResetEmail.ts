import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface IResetEmailUrlParams {
    userId: string;
}

export interface IResetEmailRequestParams extends IResetEmailUrlParams {
    email: string;
    reason: IReason;
}

const resetEmail = (params: IResetEmailRequestParams) =>
    request.call(
        (routes.auth.resetEmail as TRouteHandler)({ userId: params.userId } as any),
        {
            email: params.email,
            reason: params.reason
        }
    );

export default resetEmail;
