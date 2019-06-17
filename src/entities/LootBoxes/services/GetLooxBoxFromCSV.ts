import { AxiosResponse } from 'axios';

import { webshopTransport } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { ILootBox } from '../models/LootBox';

export interface IGetLootBoxFromCSVUrlParams {
    serviceId: string;
}

export interface IGetLootBoxFromCSVRequestParams {
    file: File;
}

export interface IGetLootBoxFromCSVResponse {
    data: ILootBox;
}

export const getLootBoxFromCSV = (
    urlParams: IGetLootBoxFromCSVUrlParams,
    requestParams: IGetLootBoxFromCSVRequestParams
) => {
    const data = new FormData();

    data.set('data', requestParams.file);

    return webshopTransport.call(
        (routes.webshop.getLootBoxFromCSV as TRouteHandler)(urlParams),
        data
    ).then(({ data: { data } }: AxiosResponse<IGetLootBoxFromCSVResponse>) => ({ data }))
    .catch(() => null)
};

export default getLootBoxFromCSV;
