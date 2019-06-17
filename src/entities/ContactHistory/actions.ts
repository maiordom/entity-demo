import uniq from 'lodash/uniq';

import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IAccount } from 'src/entities/Accounts/models/Account';

import getAccountsFromEventsService, { IGetAccountsFromEventsRequestParams, IAccountByContactHistoryEvent } from 'src/entities/Events/services/GetAccountsFromEvents';
export { IGetAccountsFromEventsRequestParams } from 'src/entities/Events/services/GetAccountsFromEvents';

import { getAccountsByIds } from 'src/entities/Accounts/services/GetAccountsByIds';

export interface ISetContactHistoryParams { contact: string; events: Array<IAccountByContactHistoryEvent>; accounts: Array<IAccount>; }
export interface ISetContactHistoryAction extends IAction<ISetContactHistoryParams> {}

export interface IOpenContactHistoryAccountParams { account: IAccount; }
export interface IOpenContactHistoryAccountAction extends IAction<IOpenContactHistoryAccountParams> {}

export interface ISetContactHistoryBrowserTabParams { id: number; }
export interface ISetContactHistoryBrowserTabAction extends IAction<ISetContactHistoryBrowserTabParams> {}

export interface ICloseContactHistoryBrowserTabParams { id: number; }
export interface ICloseContactHistoryBrowserTabAction extends IAction<ICloseContactHistoryBrowserTabParams> {}

export const {
    setContactHistory,
    openContactHistoryAccount,
    setContactHistoryBrowserTab,
    closeContactHistoryBrowserTab,
    clearAccounts
} = {
    setContactHistory: (params: ISetContactHistoryParams) => createAction('setContactHistory', params),
    openContactHistoryAccount: (params: IOpenContactHistoryAccountParams) => createAction('openContactHistoryAccount', params),
    setContactHistoryBrowserTab: (params: ISetContactHistoryBrowserTabParams) => createAction('setContactHistoryBrowserTab', params),
    closeContactHistoryBrowserTab: (params: ICloseContactHistoryBrowserTabParams) => createAction('closeContactHistoryBrowserTab', params),
    clearAccounts: () => createAction('clearAccounts'),
};

export const getAccountsFromEvents = (params: IGetAccountsFromEventsRequestParams) => async (dispatch) => {
    const { events } = await getAccountsFromEventsService(params);
    const userIds: Array<number> = uniq(events.map(event => event.userId));
    let accounts = [];

    if (events.length) {
        let accountsByIds = await getAccountsByIds({ userIds });
        accounts = accountsByIds.accounts;
    }

    dispatch(setContactHistory({
        contact: params.value,
        events,
        accounts
    }));
};
