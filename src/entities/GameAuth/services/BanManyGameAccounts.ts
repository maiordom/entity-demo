import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import { IReason } from 'src/types/IReason';
import routes from 'src/routes/api';

export interface IBanManyGameAccountsRequestParams {
    logins: Array<string>;
    reason: IReason;
    date: string;
    toPartnerId: string;
}

export interface IBanManyGameAccountsResponse {
    data: {
        id: string;
        status: string;
    };
}

export const banManyGameAccounts = (params: IBanManyGameAccountsRequestParams) =>
    request.call(
        routes.gameAuth.banManyGameAccounts, params
    ).then(({ data: { data: { status, id } } }: AxiosResponse<IBanManyGameAccountsResponse>) => ({
        id,
        status
    }));

export default banManyGameAccounts;