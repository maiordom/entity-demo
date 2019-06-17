import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IGameAccount } from '../models/GameAccount';

export interface IGetGameAccountsByQueryRequestParams {
    id?: number;
    login?: string;
    toPartnerId?: string;
}

interface IGetGameAccountsByQueryResponse {
    data: {
        items: IGameAccounts;
    };
}

export interface IGetGameAccountsByQueryResult {
    toPartnerId: string;
    userIds: Array<number>;
}

export type IGameAccounts = Array<IGameAccount>;

export const getGameAccountsByQuery = (
    params: IGetGameAccountsByQueryRequestParams
): Promise<IGetGameAccountsByQueryResult> =>
    request.call(
        (routes.gameAuth.getGameAccountsByQuery as TRouteHandler)(params)
    ).then(({ data: { data: { items } } }: AxiosResponse<IGetGameAccountsByQueryResponse>) => ({
        toPartnerId: params.toPartnerId,
        userIds: items.map(gameAccount => gameAccount.userAccount.userId)
    })).catch(() => ({
        toPartnerId: params.toPartnerId,
        userIds: []
    }));

export default getGameAccountsByQuery;
