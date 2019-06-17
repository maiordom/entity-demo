import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IPagination } from 'src/types/IPagination';
import { IAchievement } from '../models/Achievement';

export interface IGetAchievementsByServiceRequestParams {
    fromPartnerId: string;
    toPartnerId: string;
    count: number;
}

export interface IGetAchievementsByServiceResponse {
    data: IPagination<IAchievement>;
}

export type IGetAchievementsByServiceResult = Array<IAchievement>;

export const getAchievementsByService = (params: IGetAchievementsByServiceRequestParams) =>
    request.call(
        (routes.achievements.getAchievementsByService as TRouteHandler)(params)
    ).then(
        ({ data: { data: { items } } }: AxiosResponse<IGetAchievementsByServiceResponse>) =>
            items.map(item => ({
                id: item.id,
                name: item.name
            }))
    ).catch(() => []);

export default getAchievementsByService;
