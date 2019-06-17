import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IUserClaims } from 'src/entities/Claim/models/UserClaims';
import { IClaim } from '../models/Claim';

export interface IGetAllClaimsRequestParams {
    userId: string;
}

export interface IGetAllClaimsResponse {
    data: Array<IClaim>;
}

const getAllClaims = (params: IGetAllClaimsRequestParams) =>
    request.call(
        (routes.claim.getAllClaims as TRouteHandler)(params as any)
    ).then(({ data: { data } }: AxiosResponse<IGetAllClaimsResponse>) => {
        return data || [];
    });

export default getAllClaims;
