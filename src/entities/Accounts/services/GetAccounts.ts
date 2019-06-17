import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IAccount } from '../models/Account';
import { DATE_SHORT_FORMAT, DATE_PERMANENT_BAN } from 'src/constants';

export interface IGetAccountsRequestParams {
    contact: string;
}

interface IGetAccountsResponse {
    data: IAccount;
}

export interface IGetAccountsResult {
    accounts: Array<IAccount>;
}

export const getAccounts = (params: IGetAccountsRequestParams): Promise<IGetAccountsResult> =>
    request.call(
        (routes.accounts.getAccounts as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetAccountsResponse>) => ({
        accounts: [{
            id: data.id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            ban: {
                isPermanent: data.ban
                    ? moment(data.ban.until).format(DATE_SHORT_FORMAT) === DATE_PERMANENT_BAN
                    : false,
                until: data.ban
                    ? moment(data.ban.until).format('YYYY-MM-DD HH:mm')
                    : null
            }
        }]
    })).catch(() => ({
        accounts: []
    }));

export default getAccounts;
