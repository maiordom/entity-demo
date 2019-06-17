import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface IChangeProfileUrlParams {
    userId: string;
}

export interface IChangeProfileRequestParams extends IChangeProfileUrlParams {
    firstName: string;
    lastName: string;
    reason: IReason;
}

export const changeProfile = (params: IChangeProfileRequestParams) =>
    request.call(
        (routes.auth.changeProfile as TRouteHandler)({ userId: params.userId }),
        {
            firstName: params.firstName,
            lastName: params.lastName,
            reason: params.reason
        }
    );

export default changeProfile;
