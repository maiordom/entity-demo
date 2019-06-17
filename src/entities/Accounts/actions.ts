import { createAction } from 'src/utils/CreateAction';

import { IAccount } from './models/Account';
import { IRegistrationContext } from 'src/entities/Auth/models/RegistrationContext';

import getAccountsService, { IGetAccountsRequestParams } from './services/GetAccounts';
export { IGetAccountsRequestParams, IGetAccountsResult } from './services/GetAccounts';

export interface ISetAccountsParams { accounts: Array<IAccount>; }
export interface IOpenAccountParams { account: IAccount; }
export interface ISetAccountBrowserTabParams { id: number; }
export interface ICloseAccountBrowserTabParams { id: number; }
export interface IUpdateAccountParams { account: IAccount; }
export interface ISetAccountRegistrationContextParams { account: IAccount; registrationContext: IRegistrationContext; }

export const {
    setAccounts,
    openAccount,
    setAccountBrowserTab,
    closeAccountBrowserTab,
    clearAccounts,
    updateAccount,
    setAccountRegistrationContext
} = {
    setAccounts: (params: ISetAccountsParams) => createAction('setAccounts', params),
    openAccount: (params: IOpenAccountParams) => createAction('openAccount', params),
    setAccountBrowserTab: (params: ISetAccountBrowserTabParams) => createAction('setAccountBrowserTab', params),
    closeAccountBrowserTab: (params: ICloseAccountBrowserTabParams) => createAction('closeAccountBrowserTab', params),
    clearAccounts: () => createAction('clearAccounts'),
    updateAccount: (params: IUpdateAccountParams) => createAction('updateAccountAction', params),
    setAccountRegistrationContext: (params: ISetAccountRegistrationContextParams) => createAction('setAccountRegistrationContext', params)
};

export const getAccounts = (params: IGetAccountsRequestParams) => () =>
    getAccountsService(params);

export const updateAccountAction = (params: IGetAccountsRequestParams) => async (dispatch) => {
    const { accounts } = await getAccountsService(params);

    dispatch(updateAccount({ account: accounts[0] }));
};
