import { createAction } from 'src/utils/CreateAction';

import { IShopItem } from 'src/entities/ShopItems/models/ShopItem';

import getShopItemsService, { IGetShopItemsRequestParams } from './services/GetShopItems';
import getShopItemDescriptionService, { IGetShopItemDescriptionRequestParams } from 'src/entities/Documents/services/GetShopItemDescription';
import saveShopItemDescriptionService, { ISaveShopItemDescriptionRequestParams } from 'src/entities/Documents/services/SaveShopItemDescription';

export interface IGetShopItemDescriptionResult { isNewDescription: boolean; value: string;  }

export { IGetShopItemsRequestParams };
export { IGetShopItemDescriptionRequestParams };
export { ISaveShopItemDescriptionRequestParams };

export interface ISetShopItemsParams { items: Array<IShopItem>; from?: number; total?: number; }
export interface IGetShopItemBySlugParams { serviceId: string; slug: string; }
export interface IOpenShopItemParams { shopItem: IShopItem; }
export interface ISetShopBrowserTabParams { id: number; }
export interface ICloseShopBrowserTabParams { id: number; }

export const {
    setShopItems,
    setShopBrowserTab,
    closeShopBrowserTab,
    clearShopItems,
    openShopItem
} = {
    openShopItem: (params: IOpenShopItemParams) => createAction('openShopItem', params),
    setShopItems: (params: ISetShopItemsParams) => createAction('setShopItems', params),
    setShopBrowserTab: (params: ISetShopBrowserTabParams) => createAction('setShopBrowserTab', params),
    closeShopBrowserTab: (params: ICloseShopBrowserTabParams) => createAction('closeShopBrowserTab', params),
    clearShopItems: () => createAction('clearShopItems')
};

export const getShopItems = (
    params: IGetShopItemsRequestParams
) => (dispatch) => getShopItemsService(params)
    .then(({ items, from, total }) => {
        dispatch(setShopItems({ items, from, total }));
    });

export const getShopItemDescription = (
    params: IGetShopItemDescriptionRequestParams
) => (dispatch, getState): Promise<IGetShopItemDescriptionResult> =>
    getShopItemDescriptionService(params)
        .then(({ isNewDescription, value }) => ({
            isNewDescription,
            value: value[getState().area.selected.lang]
        }));

export const saveShopItemDescription = (
    params: ISaveShopItemDescriptionRequestParams
) => () =>
    saveShopItemDescriptionService(params);
