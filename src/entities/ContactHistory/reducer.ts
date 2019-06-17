import { handleActions } from 'redux-actions';
import find from 'lodash/find';
import reject from 'lodash/reject';

import * as a from './actions';
import { IStore } from 'src/store';

import { IChangedValue } from 'src/entities/Events/models/UserEvent';
import { IContactHistoryEvent } from './models/ContactHistoryEvent';

import {
    ISetContactHistoryAction,
    IOpenContactHistoryAccountAction,
    ISetContactHistoryBrowserTabAction,
    ICloseContactHistoryBrowserTabAction
} from './actions';

export default handleActions({
    [a.setContactHistory.name]: (state: IStore, { payload: { events, contact, accounts } }: ISetContactHistoryAction) => {
        events.forEach(event => {
            if (/\.changed$/.test(event.type)) {
                const value: IChangedValue = event.value as IChangedValue;

                event.type = value.new === contact
                    ? event.type.replace('changed', 'added')
                    : event.type.replace('changed', 'deleted');

                event.value = contact;
            }
        });

        let contactHistoryEvent: IContactHistoryEvent = { addedDate: null, deletedDate: null };
        const contactHistoryEvents: Array<IContactHistoryEvent> = [];

        if (events.length) {
            contactHistoryEvents.push(contactHistoryEvent);
        }

        events.reverse();
        events.forEach((event, index) => {
            contactHistoryEvent.userId = Number(event.userId);

            if (/\.added$/.test(event.type)) {
                contactHistoryEvent.addedDate = event.when;
            } else {
                contactHistoryEvent.deletedDate = event.when;
                contactHistoryEvent = { addedDate: null, deletedDate: null };

                if (index < events.length - 1) { 
                    contactHistoryEvents.push(contactHistoryEvent);
                }
            }
        });

        contactHistoryEvents.reverse();

        contactHistoryEvents.forEach(event => {
            event.account = find(accounts, { id: String(event.userId) });
        });

        state.contactHistory = {...state.contactHistory};
        state.contactHistory.searchResult = contactHistoryEvents;

        return state;
    },

    [a.clearAccounts.name]: (state: IStore) => {
        state.contactHistory.searchResult = [];
        return state;
    },

    [a.closeContactHistoryBrowserTab.name]: (state: IStore, { payload: { id } }: ICloseContactHistoryBrowserTabAction) => {
        state.contactHistory = {...state.contactHistory};

        if (id === state.contactHistory.selectedBrowserTab.id) {
            state.contactHistory.selectedBrowserTab = state.contactHistory.browserTabs[0];
            state.contactHistory.selectedItem = state.contactHistory.items[0];
        }

        state.contactHistory.browserTabs = reject(state.contactHistory.browserTabs, { id });
        state.contactHistory.items = reject(state.contactHistory.items, { id });

        return state;
    },

    [a.setContactHistoryBrowserTab.name]: (state: IStore, { payload: { id } }: ISetContactHistoryBrowserTabAction) => {
        state.contactHistory = {...state.contactHistory};

        const currentAccount = find(state.contactHistory.items, { id: String(id) });
        const currentBrowserTab = find(state.contactHistory.browserTabs, { id });

        state.contactHistory.selectedBrowserTab = currentBrowserTab;
        state.contactHistory.selectedItem = currentAccount;

        return state;
    },

    [a.openContactHistoryAccount.name]: (state: IStore, { payload: { account } }: IOpenContactHistoryAccountAction) => {
        state.contactHistory = {...state.contactHistory};

        const currentAccount = find(state.contactHistory.items, { id: account.id });
        const currentBrowserTab = find(state.contactHistory.browserTabs, { id: Number(account.id) });

        if (currentBrowserTab) {
            state.contactHistory.selectedBrowserTab = currentBrowserTab;
        } else {
            const browserTab = { id: Number(account.id), title: account.id, type: 'account' };
            state.contactHistory.browserTabs.push(browserTab);
            state.contactHistory.selectedBrowserTab = browserTab;
        }

        if (currentAccount) {
            state.contactHistory.selectedItem = account;
        } else {
            state.contactHistory.items.push(account);
            state.contactHistory.selectedItem = account;
        }

        return state;
    }
}, {});