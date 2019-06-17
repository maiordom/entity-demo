import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { IPagination } from 'src/types/IPagination';

import { ITransactionRaw, ITransaction } from '../models/Transaction';

import { DATE_LONG_FORMAT } from 'src/constants';

export interface IGetTransactionsParams {
    userId: number;
    from: number;
    count: number;
}

export interface IGetTransactionResponse {
    data: IPagination<ITransactionRaw>;
}

export interface IGetTransactionsResult {
    items: Array<ITransaction>;
}

export const getTransactions = (params: IGetTransactionsParams): Promise<IGetTransactionsResult> =>
    request.call(
        (routes.billing.getTransactions as TRouteHandler)(params)
    ).then(({ data: { data: { items } }}: AxiosResponse<IGetTransactionResponse>) => ({
        items: items.map(item => ({
            id: item.id,
            type: item.type,
            amount: item.amount,
            whenCreated: moment(item.whenCreated).format(DATE_LONG_FORMAT),
            userId: item.userId,
            createdBy: item.createdBy,
            paymentId: item.paymentId,
            bonusId: item.bonusId,
            raw: item
        }))
    })).catch(() => ({
        items: []
    }));

export default getTransactions;
