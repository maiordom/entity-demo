import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

export interface IGetUserAccountsRequestParams {
    userId: string;
    toPartnerId: string;
}

interface IGetUserAccountsResponse {
    data: {
        items: Array<{
            id: number;
        }>;
    };
}

export interface IGetUserAccountsResult {
    userAccounts: IUserAccounts;
}

export type IUserAccounts = Array<{
    userAccountId: number;
    partnerId: string;
}>;

export const getUserAccounts = (params: IGetUserAccountsRequestParams): Promise<IGetUserAccountsResult> =>
    request.call(
        routes.gameAuth.getUserAccounts, params
    ).then(({ data: { data } }: AxiosResponse<IGetUserAccountsResponse>) => ({
        userAccounts: (data.items || []).map(account => ({
            userAccountId: account.id,
            partnerId: params.toPartnerId
        }))
    })).catch(() => ({
        userAccounts: []
    }));

export default getUserAccounts;