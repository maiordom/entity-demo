import { createAction } from 'src/utils/CreateAction';

interface IDefaultActionParams { id: any; projectName: string; }

export interface ISelectBrowserTabParams extends IDefaultActionParams {}
export interface ICloseBrowserTabParams extends IDefaultActionParams {}
export interface ISetBrowserTabParams extends IDefaultActionParams { params: { title?: string; id?: any; } }

export const {
    selectBrowserTab,
    closeBrowserTab,
    setBrowserTab,
} = {
    selectBrowserTab: (params: ISelectBrowserTabParams) => createAction('selectBrowserTab', params),
    closeBrowserTab: (params: ICloseBrowserTabParams) => createAction('closeBrowserTab', params),
    setBrowserTab: (params: ISetBrowserTabParams) => createAction('setBrowserTab', params)
};
