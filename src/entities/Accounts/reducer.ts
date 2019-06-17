import { handleActions } from 'redux-actions';
import find from 'lodash/find';
import reject from 'lodash/reject';

import { IAction } from 'src/types/IAction';
import { IStore } from 'src/store';

import * as a from './actions';

export default handleActions({
    [a.setAccountRegistrationContext.name]: (state: IStore, { payload: { registrationContext, account } }: IAction<a.ISetAccountRegistrationContextParams>) => {
        account.registrationContext = registrationContext;
        state.accounts = {...state.accounts};

        if (account.id === state.accounts.selectedItem.id) {
            state.accounts.selectedItem = {...account};
        }

        return state;
    },

    [a.updateAccountAction.name]: (state: IStore, { payload: { account } }: IAction<a.IUpdateAccountParams>) => {
        const { selectedItem } = state.accounts;

        state.accounts = {...state.accounts};

        if (selectedItem.id === account.id) {
            state.accounts.selectedItem = Object.assign({}, selectedItem, account);
        }

        return state;
    },

    [a.setAccounts.name]: (state: IStore, { payload: { accounts } }: IAction<a.ISetAccountsParams>) => {
        const { searchResult } = state.accounts;

        state.accounts = {...state.accounts};
        state.accounts.searchResult = [...searchResult, ...accounts];

        return state;
    },

    [a.clearAccounts.name]: (state: IStore) => {
        state.accounts.searchResult = [];
        return state;
    },

    [a.closeAccountBrowserTab.name]: (state: IStore, { payload: { id } }: IAction<a.ICloseAccountBrowserTabParams>) => {
        state.accounts = {...state.accounts};

        if (id === state.accounts.selectedBrowserTab.id) {
            state.accounts.selectedBrowserTab = state.accounts.browserTabs[0];
            state.accounts.selectedItem = state.accounts.items[0];
        }

        state.accounts.browserTabs = reject(state.accounts.browserTabs, { id });
        state.accounts.items = reject(state.accounts.items, { id });

        return state;
    },

    [a.setAccountBrowserTab.name]: (state: IStore, { payload: { id } }: IAction<a.ISetAccountBrowserTabParams>) => {
        state.accounts = {...state.accounts};

        const currentAccount = find(state.accounts.items, { id });
        const currentBrowserTab = find(state.accounts.browserTabs, { id });

        if (currentBrowserTab) {
            state.accounts.selectedBrowserTab = currentBrowserTab;
        } else {
            const browserTab = { id, title: String(id), type: 'account' };
            state.accounts.browserTabs.push(browserTab);
            state.accounts.selectedBrowserTab = browserTab;
        }

        if (currentAccount) {
            state.accounts.selectedItem = currentAccount;
        }

        return state;
    },

    [a.openAccount.name]: (state: IStore, { payload: { account } }: IAction<a.IOpenAccountParams>) => {
        state.accounts = {...state.accounts};

        const currentAccount = find(state.accounts.items, { id: account.id });
        const currentBrowserTab = find(state.accounts.browserTabs, { id: Number(account.id) });

        if (currentBrowserTab) {
            state.accounts.selectedBrowserTab = currentBrowserTab;
        } else {
            const browserTab = { id: Number(account.id), title: account.id, type: 'account' };
            state.accounts.browserTabs.push(browserTab);
            state.accounts.selectedBrowserTab = browserTab;
        }

        if (currentAccount) {
            state.accounts.selectedItem = account;
        } else {
            state.accounts.items.push(account);
            state.accounts.selectedItem = account;
        }

        return state;
    }
}, {});
