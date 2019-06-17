import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { ILootBox } from '../models/LootBox';

export interface IChangeLootBoxUrlParams {
    serviceId: string;
}

export interface IChangeLootBoxRequestParams {
    value: ILootBox;
}

export const changeLootBox = (
    urlParams: IChangeLootBoxUrlParams,
    params: IChangeLootBoxRequestParams
) =>
    request.call(
        (routes.webshop.changeLootBox as TRouteHandler)(urlParams),
        params
    );

export default changeLootBox;
