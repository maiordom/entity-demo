import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IAddClaimRequestParams {
    userId: string;
    claim: string;
    value: string;
}

const addClaim = (params: IAddClaimRequestParams) =>
    request.call(
        (routes.claim.addClaim as TRouteHandler)(params as any)
    ).catch(() => null);

export default addClaim;
