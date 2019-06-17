import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IBalance } from '../models/Balance';

export interface IGetAccountBalanceRequestParams {
    userId: string;
}

export interface IGetAccountBalanceResponse {
    data: IBalance;
}

export const getAccountBalance = (params) =>
    request.call(
        (routes.billing.getAccountBalance as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetAccountBalanceResponse>) => ({
        balance: {
            money: data.money,
            bonus: data.bonus,
            balance: data.balance,
            isTest: data.isTest
        }
    }));

export default getAccountBalance;
