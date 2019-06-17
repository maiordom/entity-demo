import { handleActions } from 'redux-actions';

import { IAction } from 'src/types/IAction';

import * as a from './actions';
import { IStore } from 'src/store';

export default handleActions({
    [a.setAccountBalance.name]: (state: IStore, { payload: { userId, balance } }: IAction<a.ISetAccountBalanceParams>) => {
        state.billing.balance[userId] = balance;
        return state;
    },

    [a.setTransactions.name]: (state: IStore, { payload: { items, from } }: IAction<a.ISetTransactionsParams>) => {
        state.billing.transactions = {...state.billing.transactions};
        const hasNextPage = state.billing.transactions.count + from === items.length;

        Object.assign(state.billing.transactions, {
            hasNextPage,
            from
        });
        state.billing.transactions.items = items;
        return state;
    },

    [a.setTransactionsValue.name]: (state, { payload: { value } }: IAction<a.ISetTransactionsValueParams>) => {
        state.billing.transactions = {...state.billing.transactions};
        state.billing.transactions.value = value;
        return state;
    }
}, {});
