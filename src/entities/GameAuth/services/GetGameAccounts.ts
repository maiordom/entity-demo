import { AxiosResponse } from 'axios';
import get from 'lodash/get';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IGameAccount } from '../models/GameAccount';
import { DATE_PERMANENT_BAN, DATE_SHORT_FORMAT } from 'src/constants';

export interface IGetGameAccountsRequestParams {
    userAccountId: number;
    toPartnerId: string;
}

interface IGetGameAccountsResponse {
    data: {
        gameAccounts: IGameAccounts;
    };
}

export interface IGetGameAccountsResult {
    gameAccounts: IGameAccounts;
}

export type IGameAccounts = Array<IGameAccount>;

export const getGameAccounts = (params: IGetGameAccountsRequestParams): Promise<IGetGameAccountsResult> =>
    request.call(
        (routes.gameAuth.getGameAccounts as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetGameAccountsResponse>) => ({
        gameAccounts: data.gameAccounts.map(gameAccount => ({
            id: gameAccount.id,
            login: gameAccount.login,
            partnerId: params.toPartnerId,
            created: moment(gameAccount.created).utc().format(DATE_SHORT_FORMAT),
            lastLoginTime: gameAccount.lastLoginTime
                ? moment(gameAccount.lastLoginTime).utc().format(DATE_SHORT_FORMAT)
                : null,
            subscriptionUntil: gameAccount.subscriptionUntil
                ? moment(gameAccount.subscriptionUntil).utc().format(DATE_SHORT_FORMAT)
                : null,
            ban: {
                until: get(gameAccount, 'ban.until'),
                isPermanent: gameAccount.ban && gameAccount.ban.until
                    ? moment(gameAccount.ban.until).format(DATE_SHORT_FORMAT) === DATE_PERMANENT_BAN
                    : false,
                reason: {
                    internal: get(gameAccount, 'ban.reason.internal'),
                    external: {
                        ru: get(gameAccount, 'ban.reason.external.ru'),
                        en: get(gameAccount, 'ban.reason.external.en'),
                        pt: get(gameAccount, 'ban.reason.external.pt')
                    }
                }
            }
        }))
    })).catch(() => ({
        gameAccounts: []
    }));

export default getGameAccounts;
