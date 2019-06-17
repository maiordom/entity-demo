import { createAction } from 'src/utils/CreateAction';

import { IBalance } from './models/Balance';
import { ITransaction } from 'src/entities/Billing/models/Transaction';

import getAccountBalanceService, { IGetAccountBalanceRequestParams } from './services/GetAccountBalance';
export { IGetAccountBalanceRequestParams } from './services/GetAccountBalance';

import setTestMoneyService, { ISetTestMoneyParams } from './services/SetTestMoney';
export { ISetTestMoneyParams } from './services/SetTestMoney';

import setTestAccountService, { ISetTestAccountParams } from './services/SetTestAccount';
export { ISetTestAccountParams } from './services/SetTestAccount';

export interface ISetAccountBalanceParams { userId: string; balance: IBalance }
export interface ISetTransactionsParams { items: Array<ITransaction>; from: number; }
export interface ISetTransactionsValueParams { value: string; }

export const {
    setAccountBalance,
    setTransactions,
    setTransactionsValue
} = {
    setAccountBalance: (params: ISetAccountBalanceParams) => createAction('setAccountBalance', params),
    setTransactions: (params: ISetTransactionsParams) => createAction('setTransactions', params),
    setTransactionsValue: (params: ISetTransactionsValueParams) => createAction('setTransactionsValue', params)
};

export const getAccountBalance = (params: IGetAccountBalanceRequestParams) => (dispatch) =>
    getAccountBalanceService(params).then(({ balance }) => {
        dispatch(setAccountBalance({ userId: params.userId, balance }));
    });

export const setTestMoney = (params: ISetTestMoneyParams) => async (dispatch) => {
    await setTestMoneyService(params);
    dispatch(getAccountBalance({ userId: params.userId }));
};

export const setTestAccount = (params: ISetTestAccountParams) => async (dispatch) => {
    await setTestAccountService(params);

    return dispatch(getAccountBalance({
        userId: params.userId.toString()
    }));
};
