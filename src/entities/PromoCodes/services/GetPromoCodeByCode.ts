import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IGetPromoCodeByCodeRequestParams {
    promoCode: string;
}

export interface IGetPromoCodeByCodeResponse {
    data: {
        id: string;
    };
}

export interface IGetPromoCodeByCodeResult {
    id: string;
}

export const getPromoCodeByCode = (params: IGetPromoCodeByCodeRequestParams) =>
    request.call(
        (routes.promoCodes.getPromoCodeByCode as TRouteHandler)(params)
    ).then(({ data: { data: { id } }}: AxiosResponse<IGetPromoCodeByCodeResponse>) => ({
        id
    })).catch(() => ({
        id: null
    }));

export default getPromoCodeByCode;
