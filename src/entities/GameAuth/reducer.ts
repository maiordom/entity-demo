import { handleActions } from 'redux-actions';
import find from 'lodash/find';

import * as a from './actions';
import { IStore } from 'src/store';

import { IGameAccount } from 'src/entities/GameAuth/models/GameAccount';

import {
    ISetGameAccountsAction,
    ISetGameAccountBanAction,
    ISetGameAccountSubscriptionAction
} from './actions';

export default handleActions({
    [a.setGameAccounts.name]: (state: IStore, { payload: { gameAccounts, userId } }: ISetGameAccountsAction) => {
        state.gameAuth[userId] = gameAccounts;
        return state;
    },

    [a.setGameAccountBan.name]: (state: IStore, { payload: { accountId, ban, userId } }: ISetGameAccountBanAction) => {
        const gameAccounts = state.gameAuth[userId];
        const account = find(gameAccounts, { id: accountId });

        if (account) {
            account.ban = ban;
            state.gameAuth[userId] = [...gameAccounts];
        }

        return state;
    },

    [a.setGameAccountSubscription.name]: (state: IStore, { payload: { login, userId, until } }: ISetGameAccountSubscriptionAction) => {
        const gameAccounts = state.gameAuth[userId];
        const gameAccount: IGameAccount = find(gameAccounts, { login });

        gameAccount.subscriptionUntil = until;
        state.gameAuth[userId] = [...gameAccounts];

        return state; 
    }
}, {});
