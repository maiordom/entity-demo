import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteClaimRequestParams {
    userId: string;
    claim: string;
    value: string;
}

const deleteClaim = (params: IDeleteClaimRequestParams) =>
    request.call(
        (routes.claim.deleteClaim as TRouteHandler)(params as any)
    ).catch(() => null);

export default deleteClaim;
