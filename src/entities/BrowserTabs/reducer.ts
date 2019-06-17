import { handleActions } from 'redux-actions';
import reject from 'lodash/reject';
import find from 'lodash/find';

import { IBrowserTab } from 'src/types/IBrowserTab';

import * as a from './actions';
import { IAction } from 'src/types/IAction';
import { IStore } from 'src/store';

export default handleActions({
    [a.closeBrowserTab.name]: (state: IStore, { payload: { id, projectName } }: IAction<a.ICloseBrowserTabParams>) => {
        const tabs = state.browserTabs[projectName];

        if (id == tabs.selected.id) {
            tabs.selected = tabs.items[0];
        }

        tabs.items = reject(tabs.items, item => item.id == id );
        state.browserTabs[projectName] = { ...tabs };

        return state;
    },

    [a.selectBrowserTab.name]: (state: IStore, { payload: { id, projectName } }: IAction<a.ISelectBrowserTabParams>) => {
        const tabs = state.browserTabs[projectName];
        const currentBrowserTab = find(tabs.items, item => item.id == id);

        tabs.selected = currentBrowserTab;
        state.browserTabs[projectName] = { ...tabs };

        return state;
    },

    [a.setBrowserTab.name]: (state: IStore, { payload: { id, params, projectName } }: IAction<a.ISetBrowserTabParams>) => {
        const tabs = state.browserTabs[projectName];

        tabs.items = [ ...tabs.items ];

        if (tabs.selected && id == tabs.selected.id) {
            Object.assign(tabs.selected, params);
        } else {
            tabs.items.push({ id, ...params } as IBrowserTab);
        }

        state.browserTabs[projectName] = { ...tabs };

        return state;
    }
}, {});
