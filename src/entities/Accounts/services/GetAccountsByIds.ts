import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IAccount } from '../models/Account';
import { DATE_SHORT_FORMAT, DATE_PERMANENT_BAN } from 'src/constants';

export interface IGetAccountsByIdsRequestParams {
    userIds: Array<number>;
}

interface IGetAccountsByIdsResponse {
    data: Array<IAccount>;
}

export interface IGetAccountsByIdsResult {
    accounts: Array<IAccount>;
}

export const getAccountsByIds = (params: IGetAccountsByIdsRequestParams): Promise<IGetAccountsByIdsResult> =>
    request.call(
        (routes.accounts.getAccountsByIds as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetAccountsByIdsResponse>) => ({
        accounts: data.map((account) => ({
            id: String(account.id),
            username: account.username,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            phone: account.phone,
            ban: {
                isPermanent: account.ban
                    ? moment(account.ban.until).format(DATE_SHORT_FORMAT) === DATE_PERMANENT_BAN
                    : false,
                until: account.ban
                    ? moment(account.ban.until).format('YYYY-MM-DD HH:mm')
                    : null
            }
        }))
    })).catch(() => ({
        accounts: []
    }));

export default getAccountsByIds;
