import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';
import { download } from 'src/utils/Download';

import getGameShopItemsService, { IGetGameShopItemsRequestParams } from './services/GetGameShopItems';
export { IGetGameShopItemsRequestParams } from './services/GetGameShopItems';

import addGameShopItemsService, { IAddGameShopItemsRequestParams } from './services/AddGameShopItems';
export { IAddGameShopItemsRequestParams } from './services/AddGameShopItems';

import cancelGameShopOrderService, { ICancelGameShopOrderRequestParams } from './services/CancelGameShopOrder';
export { ICancelGameShopOrderRequestParams } from './services/CancelGameShopOrder';

import addGameShopItemService, { IAddGameShopItemRequestParams } from './services/AddGameShopItem';
export { IAddGameShopItemRequestParams } from './services/AddGameShopItem';

import editGameShopItemService, { IEditGameShopItemRequestParams } from './services/EditGameShopItem';
export { IEditGameShopItemRequestParams } from './services/EditGameShopItem';

import deleteGameShopItemService, { IDeleteGameShopItemRequestParams } from './services/DeleteGameShopItem';
export { IDeleteGameShopItemRequestParams } from './services/DeleteGameShopItem';

import { IGameShopItem } from './models/GameShopItem';

import { IStore } from 'src/store';

export interface ISetGameShopItemsParams { page: number; items: Array<IGameShopItem>; total: number; serviceId: string; }
export interface ISetGameShopItemsAction extends IAction<ISetGameShopItemsParams> {}

export const {
    setGameShopItems
} = {
    setGameShopItems: (params: ISetGameShopItemsParams) => createAction('setGameShopItems', params)
};

export const getGameShopItems = (params: IGetGameShopItemsRequestParams, { page }: { page: number }) => async (dispatch) => {
    const { items, total } = await getGameShopItemsService(params);

    dispatch(setGameShopItems({
        items,
        total,
        serviceId: params.toPartnerId,
        page
    }));
};

export const addGameShopItems = (params: IAddGameShopItemsRequestParams) => () =>
    addGameShopItemsService(params);

export const addGameShopItem = (params: IAddGameShopItemRequestParams) => () =>
    addGameShopItemService(params);

export const editGameShopItem = (params: IEditGameShopItemRequestParams) => () =>
    editGameShopItemService(params);

export const deleteGameShopItem = (params: IDeleteGameShopItemRequestParams) => () =>
    deleteGameShopItemService(params);

const getAllGameShopItems = async (toPartnerId: string, total: number, count: number) => {
    const requestCount = Math.ceil(total / count);
    let gameShopItems = [];

    for (let i = 0; i < requestCount; i++) {
        const { items } = await getGameShopItemsService({
            offset: i * count,
            count: count,
            toPartnerId
        });

        gameShopItems = [...gameShopItems, ...items];
    }

    return gameShopItems;
};

export const exportGameShopItems = (toPartnerId: string) => async (dispatch, getState: () => IStore) => {
    const state = getState();
    const { total } = state.gameShop.items[toPartnerId];
    const { count } = state.gameShop.pagination;

    const items = await getAllGameShopItems(toPartnerId, total, count);

    let content = '';

    items.forEach(item => {
        content += `${item.id}`;

        ['ru', 'en', 'pt'].forEach(key => {
            if (key in item.name) {
                content += `;${item.name[key]}`;
            }
        });

        content += '\n';
    });

    download(
        `gameshop-items-${toPartnerId}.csv`,
        content,
        'text/plain'
    );
};

export const cancelGameShopOrder = (params: ICancelGameShopOrderRequestParams) => () =>
    cancelGameShopOrderService(params);
