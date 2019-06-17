import { IBrowserTab } from 'src/types/IBrowserTab';

const DEFAULT_TAB: IBrowserTab = {
    id: null,
    title: 'Наборы'
};

export interface IBrowserTabs {
    [key: string]: IBrowserTabsItem;
}

export interface IBrowserTabsItem {
    items: Array<IBrowserTab>;
    selected: IBrowserTab;
}

export const browserTabs: IBrowserTabs = {
    aionLootBoxes: {
        items: [ DEFAULT_TAB ],
        selected: DEFAULT_TAB
    },
    pbLootBoxes: {
        items: [ DEFAULT_TAB ],
        selected: DEFAULT_TAB
    }
}