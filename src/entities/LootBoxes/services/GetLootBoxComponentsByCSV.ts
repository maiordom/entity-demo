import { AxiosResponse } from 'axios';

import { webshopTransport } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IGetLootBoxComponentsByCSVRequestParams {
    serviceId: string;
    slug: string;
}

export interface IGetLootBoxComponentsByCSVResponse {
    data: string;
}

export const getLootBoxComponentsByCSV = (params: IGetLootBoxComponentsByCSVRequestParams) =>
    webshopTransport.call(
        (routes.webshop.getLootBoxComponentsByCSV as TRouteHandler)(params)
    ).then(({ data }: AxiosResponse<IGetLootBoxComponentsByCSVResponse>) => ({ data }));

export default getLootBoxComponentsByCSV;
