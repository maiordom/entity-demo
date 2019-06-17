import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IPagination } from 'src/types/IPagination';
import { ILootBox } from '../models/LootBox';

export interface IGetLootBoxesRequestParams {
    from?: number;
    count?: number;
    serviceId: string;
}

export interface IGetLootBoxesResponse {
    data: IPagination<ILootBox>;
}

export interface IGetLootBoxesResult {
    items: Array<ILootBox>;
}

export const getLootBoxes = (params: IGetLootBoxesRequestParams) => (
    request.call(
        (routes.webshop.getLootBoxes as TRouteHandler)(params)
    ).then(({ data: { data: { items } } }: AxiosResponse<IGetLootBoxesResponse>) => ({
        items: items.map(item => ({
            id: item.id,
            slug: item.slug,
            type: item.type,
            name: item.name,
            withdrawn: item.withdrawn,
            versions: item.versions || [],
            components: item.components || []    
        }))
    }))
);

export default getLootBoxes;
