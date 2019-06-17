import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface IDeletePhoneUrlParams {
    userId: string;
}

export interface IDeletePhoneRequestParams extends IDeletePhoneUrlParams {
    reason: IReason;
}

export const deletePhone = (params: IDeletePhoneRequestParams) =>
    request.call(
        (routes.auth.deletePhone as TRouteHandler)({ userId: params.userId }),
        { reason: params.reason }
    );

export default deletePhone;
