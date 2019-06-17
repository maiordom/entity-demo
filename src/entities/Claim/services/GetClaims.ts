import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IUserClaims } from 'src/entities/Claim/models/UserClaims';
import { IClaim } from '../models/Claim';

export interface IGetClaimsRequestParams {
    userId: string;
}

export interface IGetClaimsResponse {
    data: Array<IClaim>;
}

export type IGetClaimsResult =  Array<IClaim>;

const getClaims = (params: IGetClaimsRequestParams) =>
    request.call(
        (routes.claim.getClaims as TRouteHandler)(params as any)
    ).then(({ data: { data } }: AxiosResponse<IGetClaimsResponse>): IGetClaimsResult => {
        return data || [];
    });

export default getClaims;
