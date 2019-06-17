import { IAccount } from 'src/entities/Accounts/models/Account';
import { IContactHistoryEvent } from './models/ContactHistoryEvent';
export { IContactHistoryEvent } from './models/ContactHistoryEvent';

import { IBrowserTab } from 'src/types/IBrowserTab';

export interface IContactHistory {
    items: Array<IAccount>;
    selectedItem: IAccount;
    searchResult: Array<IContactHistoryEvent>;
    browserTabs: Array<IBrowserTab>;
    selectedBrowserTab: IBrowserTab;
}

const DEFAULT_TAB: IBrowserTab = {
    id: null,
    title: 'Поиск истории изменения контактов'
};

export const contactHistory: IContactHistory = {
    items: [],
    selectedItem: null,
    searchResult: null,
    browserTabs: [ DEFAULT_TAB ],
    selectedBrowserTab: DEFAULT_TAB
};
