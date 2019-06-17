import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { IValue } from 'src/types/IValue';

export interface IRemoveAccountReason {
    internal: string;
    external: IValue;
}

export interface IRemoveAccountRequestParams {
    userId: string;
    reason: IRemoveAccountReason;
}

export const removeAccount = (params: IRemoveAccountRequestParams): Promise<any> =>
    request.call(
        (routes.accounts.removeAccount as TRouteHandler)(params),
        params
    );

export default removeAccount;
