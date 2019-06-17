import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { ILootBox } from '../models/LootBox';

export interface ICreateLootBoxUrlParams {
    serviceId: string;
}

export interface ICreateLootBoxRequestParams {
    value: ILootBox;
}

interface IResult {
    id: any;
}

export interface ICreateLootBoxResponse<T> {
    data: IResult;
}

export type ICreateLootBoxResult = IResult;

export const createLootBox = (
    urlParams: ICreateLootBoxUrlParams,
    params: ICreateLootBoxRequestParams
) =>
    request.call(
        (routes.webshop.createLootBox as TRouteHandler)(urlParams),
        params
    ).then(({ data: { data } }: AxiosResponse<ICreateLootBoxResponse<IResult>>) => (data))
    .catch(() => ({
        id: null
    }));

export default createLootBox;
