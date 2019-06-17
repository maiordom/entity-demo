import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { ILootBox } from '../models/LootBox';

export interface IGetLootBoxRequestParams {
    id: any;
    serviceId: string;
}

export interface IGetLootBoxResponse {
    data: ILootBox;
}

export type IGetLootBoxResult = ILootBox;

export const getLootBox = (params: IGetLootBoxRequestParams) =>
    request.call(
        (routes.webshop.getLootBox as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetLootBoxResponse>) => ({
        id: data.id,
        slug: data.slug,
        type: data.type,
        name: data.name,
        withdrawn: data.withdrawn,
        versions: data.versions || [],
        components: data.components || []
    }))
    .catch(() => null);

export default getLootBox;
