import { AxiosResponse, AxiosError } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { ILocale } from 'src/entities/Documents/models/Version';

export type IGetShopItemDescriptionRequestParams = {
    serviceId: string;
    id: number;
};

interface IGetShopItemDescriptionResponse {
    data: { body: ILocale };
}

export interface IGetShopItemDescriptionResult {
    isNewDescription: boolean;
    value: ILocale;
}

export const getShopItemDescription = (params: IGetShopItemDescriptionRequestParams) =>
    request.call((routes.documents.getShopItemDescription as TRouteHandler)(params))
        .then(({ data: { data }}: AxiosResponse<IGetShopItemDescriptionResponse>): IGetShopItemDescriptionResult => ({
            isNewDescription: false,
            value: data.body
        })).catch(({ response }) => {
            if (response.status === 404) {
                return {
                    isNewDescription: true,
                    value: ''
                }
            }
        });

export default getShopItemDescription;
