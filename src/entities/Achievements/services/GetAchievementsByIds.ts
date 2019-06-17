import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IAchievementStep {
    name: string;
    isCompleted: boolean;
    total: number;
    current: number;
}

export interface IAchievement {
    id: number;
    name: string;
    award: string;
    executions: number;
    onlyOnce: boolean;
    steps: Array<IAchievementStep>;
}

export interface IGetAchievementsByIdsRequestParams {
    userId: string;
    ids: Array<number>;
    toPartnerId: string;
}

export interface IGetAchievementsByIdsResponse {
    data: Array<IAchievement>;
}

export const getAchievementsByIds = (params: IGetAchievementsByIdsRequestParams) =>
    request.call(
        (routes.achievements.getAchievementsByIds as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetAchievementsByIdsResponse>) => data)
    .catch(() => []);

export default getAchievementsByIds;
