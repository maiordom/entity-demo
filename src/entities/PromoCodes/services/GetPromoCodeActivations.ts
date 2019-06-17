import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { IPagination } from 'src/types/IPagination';

import { IPromoCodeActivation } from '../models/PromoCodeActivation';
import { DATE_SHORT_FORMAT } from 'src/constants';

export interface IGetPromoCodeActivationsRequestParams {
    promoCodeId: string;
    from: number;
    count: number;
}

export interface IGetPromoCodeActivationsResponse {
    data: IPagination<{
        userId: string;
        whenActivated: string;
    }>;
}

export interface IGetPromoCodeActivationsResult {
    total: number;
    items: Array<IPromoCodeActivation>;
}

export const getPromoCodeActivations = (params: IGetPromoCodeActivationsRequestParams) =>
    request.call(
        (routes.promoCodes.getPromoCodeActivations as TRouteHandler)(params)
    ).then(({ data: { data: { total, items } }}: AxiosResponse<IGetPromoCodeActivationsResponse>) => ({
        items: items.map(({ userId, whenActivated }) => ({
            userId,
            whenActivated: moment(whenActivated).format(DATE_SHORT_FORMAT)
        })),
        total
    })).catch(() => ({
        items: [],
        total: null
    }));

export default getPromoCodeActivations;
