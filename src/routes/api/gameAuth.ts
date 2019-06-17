import qs from 'qs';

import { IGetGameAccountsRequestParams } from 'src/entities/GameAuth/services/GetGameAccounts';
import { IGetGameAccountsByQueryRequestParams } from 'src/entities/GameAuth/services/GetGameAccountsByQuery';

export default {
    getUserAccounts: {
        url: '/api/pgw/game/auth/private/user/account/',
        method: 'GET'
    },
    getGameAccounts: ({ userAccountId, ...params }: IGetGameAccountsRequestParams) => ({
        url: `/api/pgw/game/auth/private/user/account/${userAccountId}?${qs.stringify(params)}`,
        method: 'GET',
        claim: 'ga.read.accounts'
    }),
    getGameAccountsByQuery: (params: IGetGameAccountsByQueryRequestParams) => ({
        url: `/api/pgw/game/auth/private/game/account/?${qs.stringify(params)}`,
        method: 'GET'
    }),
    banGameAccount: {
        url: '/api/pgw/game/auth/account/ban/',
        method: 'PUT',
        claim: 'ga.write.accounts'
    },
    unbanGameAccount: {
        url: '/api/pgw/game/auth/private/game/account/unban/',
        method: 'PUT'
    },
    banManyGameAccounts: {
        url: '/api/pgw/game/auth/private/game/account/banmany/',
        method: 'POST'
    }
};
