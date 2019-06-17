import { IAccount } from './models/Account';

import { IBrowserTab } from 'src/types/IBrowserTab';

export interface IAccounts {
    items: Array<IAccount>;
    selectedItem: IAccount;
    searchResult: Array<IAccount>;
    browserTabs: Array<IBrowserTab>;
    selectedBrowserTab: IBrowserTab;
}

const DEFAULT_TAB: IBrowserTab = {
    id: null,
    title: 'Поиск аккаунтов'
};

export const accounts: IAccounts = {
    items: [],
    selectedItem: null,
    searchResult: [],
    browserTabs: [ DEFAULT_TAB ],
    selectedBrowserTab: DEFAULT_TAB
};
