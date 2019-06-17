import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IGameAccount, IGameAccountBan } from './models/GameAccount';
import { IStore } from 'src/store';

import { getAccounts, IGetAccountsResult } from 'src/entities/Accounts/actions';
import { setAccounts } from 'src/entities/Accounts/actions';

import getUserAccountsService, { IGetUserAccountsResult, IUserAccounts } from './services/GetUserAccounts';
import getGameAccountsService, { IGetGameAccountsResult, IGameAccounts } from './services/GetGameAccounts';

import banManyGameAccountsService, { IBanManyGameAccountsRequestParams } from './services/BanManyGameAccounts';
export { IBanManyGameAccountsRequestParams } from './services/BanManyGameAccounts';

import banGameAccountService, { IBanGameAccountRequestParams } from './services/BanGameAccount';
export { IBanGameAccountRequestParams } from './services/BanGameAccount';

import unbanGameAccountService, { IUnbanGameAccountRequestParams } from './services/UnbanGameAccount';
export { IUnbanGameAccountRequestParams } from './services/UnbanGameAccount';

import getGameAccountsByQueryService, { IGetGameAccountsByQueryRequestParams, IGetGameAccountsByQueryResult } from './services/GetGameAccountsByQuery';
export { IGetGameAccountsByQueryRequestParams } from './services/GetGameAccountsByQuery';

import { IGetJobResult } from 'src/entities/Jobs/actions';
export { IGetJobResult } from 'src/entities/Jobs/actions';

import { checkJob } from 'src/entities/Jobs/actions';

export interface ISetGameAccountsParams { userId: string; gameAccounts: Array<IGameAccount>; }
export interface ISetGameAccountsAction extends IAction<ISetGameAccountsParams> {}

export interface ISetGameAccountBanParams { userId: string; accountId: number; ban: IGameAccountBan; }
export interface ISetGameAccountBanAction extends IAction<ISetGameAccountBanParams> {}

export interface ISetGameAccountSubscriptionParams { userId: string; login: string; until: string; }
export interface ISetGameAccountSubscriptionAction extends IAction<ISetGameAccountSubscriptionParams> {}

export const {
    setGameAccounts,
    setGameAccountBan,
    setGameAccountSubscription
} = {
    setGameAccounts: (params: ISetGameAccountsParams) => createAction('setGameAccounts', params),
    setGameAccountBan: (params: ISetGameAccountBanParams) => createAction('setGameAccountBan', params),
    setGameAccountSubscription: (params: ISetGameAccountSubscriptionParams) => createAction('setGameAccountSubscription', params)
};

export const banManyGameAccounts = (params: IBanManyGameAccountsRequestParams) => async (): Promise<IGetJobResult> => {
    const { id } = await banManyGameAccountsService(params);

    return checkJob({ id, toPartnerId: params.toPartnerId });
};

export const getAccountsByGameAccountParams = (params: IGetGameAccountsByQueryRequestParams) => async (dispatch, getState: () => IStore) => {
    const { permissions } = getState().user;
    const { area } = getState();
    const toPartnerIds = (permissions['ga.read.accounts'] || [])
        .filter(key => key.indexOf(area.selected.id) !== -1);
    const gameAccountPromises: Array<Promise<IGetGameAccountsByQueryResult>> = [];

    toPartnerIds.forEach(toPartnerId => {
        const promise = getGameAccountsByQueryService({ ...params, toPartnerId });
        gameAccountPromises.push(promise);
    });

    const userMasterIds = await Promise.all(gameAccountPromises).then(res =>
        res.reduce((result, item) => [...result, ...item.userIds], [])
    );

    const accountsPromises: Array<Promise<IGetAccountsResult>> = [];

    userMasterIds.forEach(userId => {
        const getAccountsPromise = getAccounts({ contact: userId })();
        accountsPromises.push(getAccountsPromise);
    });

    return Promise.all(accountsPromises).then(res => {
        const accounts = res.reduce((result, item) => [...result, ...item.accounts], []);
        accounts.forEach(account => {
            account.extraInfo = params;
        });
        dispatch(setAccounts({ accounts }));
    });
};

export const banGameAccount = (params: IBanGameAccountRequestParams) => () =>
    banGameAccountService(params);

export const unbanGameAccount = (params: IUnbanGameAccountRequestParams) => () =>
    unbanGameAccountService(params);

export const getGameAccounts = (userId: string) => async (dispatch, getState: () => IStore) => {
    const { permissions } = getState().user;
    const { area } = getState();
    const toPartnerIds = (permissions['ga.read.accounts'] || [])
        .filter(key => key.indexOf(area.selected.id) !== -1);
    const userAccountsPromises: Array<Promise<IGetUserAccountsResult>> = [];

    toPartnerIds.forEach(toPartnerId => {
        const promise = getUserAccountsService({ userId, toPartnerId });
        userAccountsPromises.push(promise);
    });

    const userAccounts: IUserAccounts = await Promise.all(userAccountsPromises).then(res =>
        res.reduce((result, item) => [...result, ...item.userAccounts], [])
    );

    const gameAccountsPromises: Array<Promise<IGetGameAccountsResult>> = [];

    userAccounts.forEach(userAccount => {
        const promise = getGameAccountsService({
            userAccountId: userAccount.userAccountId,
            toPartnerId: userAccount.partnerId
        });

        gameAccountsPromises.push(promise);
    });

    const gameAccounts: IGameAccounts = await Promise.all(gameAccountsPromises).then(res =>
        res.reduce((result, item) => [...result, ...item.gameAccounts], [])
    );

    dispatch(setGameAccounts({ gameAccounts, userId }));
};
