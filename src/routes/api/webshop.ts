import qs from 'qs';

import { IGetShopItemsRequestParams } from 'src/entities/ShopItems/services/GetShopItems';
import { IGetProductRequestParams } from 'src/entities/Product/services/GetProduct';
import { IGetLootBoxRequestParams } from 'src/entities/LootBoxes/services/GetLootBox';
import { IGetLootBoxComponentsByCSVRequestParams } from 'src/entities/LootBoxes/services/GetLootBoxComponentsByCSV';
import { IGetLootBoxesRequestParams } from 'src/entities/LootBoxes/services/GetLootBoxes';
import { IDeleteProductRequestParams } from 'src/entities/Webshop/services/DeleteProduct';
import { IChangeLootBoxUrlParams } from 'src/entities/LootBoxes/services/ChangeLootBox';
import { ICreateLootBoxUrlParams } from 'src/entities/LootBoxes/services/CreateLootBox';

export type TImportType = 'csv' | 'dump';
export type TExportType = 'csv';

const serviceIdMapping = {
    'aion-ru': 'aion',
    'pb-ru': 'pb'
};

export default {
    importProducts: ({ serviceId, type = 'csv' }: { serviceId: string; type: TImportType }) => ({
        method: 'PUT',
        timeout: 1000 * 60 * 60 * 3, // 3h
        url: `/1.0/admin/products/apps/${serviceId}/${type}`
    }),
    exportProducts: ({ serviceId, type = 'csv' }: { serviceId: string, type?: TExportType }) => ({
        method: 'GET',
        timeout: 1000 * 60 * 60 * 3, // 3h
        url: `/1.0/admin/products/apps/${serviceId}/${type}`
    }),
    exportSingles: ({ serviceId, type = 'csv' }) => ({
        url: `/1.0/admin/products/apps/${serviceId}/singlegames/${type}`,
        timeout: 1000 * 60 * 60 * 3, // 3h
        method: 'GET'
    }),
    importSingles: ({ serviceId, type = 'csv' }) => ({
        url: `/1.0/admin/products/apps/${serviceId}/singlegames/${type}`,
        timeout: 1000 * 60 * 60 * 3, // 3h
        method: 'PUT'
    }),
    getShopItems: ({ serviceId, count, from, categoryId, name }: IGetShopItemsRequestParams) => ({
        method: 'GET',
        url: `/api/webshop/admin/products/services/${serviceId}/editable/?${qs.stringify({ categoryId, from, count, name })}`
    }),
    cancelOrder: {
        url: '/api/webshop/admin/orders/cancelled/',
        method: 'POST'
    },
    getProduct: ({ productId }: IGetProductRequestParams) => ({
        url: `/api/webshop/admin/products/${productId}`,
        method: 'GET'
    }),
    getLootBoxes: ({ serviceId, ...params }: IGetLootBoxesRequestParams) => ({
        url: `/api/webshop/admin/products/services/${serviceIdMapping[serviceId]}/editable/lootboxes?${qs.stringify(params)}`,
        method: 'GET'
    }),
    getLootBox: ({ id, serviceId }: IGetLootBoxRequestParams) => ({
        url: `/api/webshop/admin/products/services/${serviceIdMapping[serviceId]}/editable/lootboxes/${id}`,
        method: 'GET'
    }),
    getLootBoxFromCSV: () => ({
        url: `/1.0/admin/products/services/aion/editable/lootboxes/describe/csv`,
        method: 'POST'
    }),
    getLootBoxComponentsByCSV: ({ slug, serviceId }: IGetLootBoxComponentsByCSVRequestParams) => ({
        url: `/1.0/admin/products/lootboxes/services/${serviceId}/slugs/${slug}/csv`,
        method: 'GET'
    }),
    changeLootBox: ({ serviceId }: IChangeLootBoxUrlParams) => ({
        url: `/api/webshop/admin/products/editable/lootboxes/${serviceIdMapping[serviceId]}`,
        method: 'PUT'
    }),
    createLootBox: ({ serviceId }: ICreateLootBoxUrlParams) => ({
        url: `/api/webshop/admin/products/editable/lootboxes/${serviceIdMapping[serviceId]}`,
        method: 'POST'
    }),
    deleteProduct: ({ id }: IDeleteProductRequestParams) => ({
        url: `/api/webshop/admin/products/${id}`,
        method: 'DELETE'
    })
};
