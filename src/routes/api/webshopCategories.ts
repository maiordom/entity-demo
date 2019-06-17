import { IDeleteWebshopCategoryRequestParams } from 'src/entities/WebshopCategories/services/DeleteWebshopCategory';
import { IGetWebshopCategoriesRequestParams } from 'src/entities/WebshopCategories/services/GetWebshopCategories';

export default {
    getWebshopCategories: ({ serviceId }: IGetWebshopCategoriesRequestParams) => ({
        url: `/api/webshop/admin/categories/services/${serviceId}`,
        method: 'GET'
    }),
    editWebshopCategory: {
        url: '/api/webshop/admin/categories/',
        method: 'PUT'
    },
    createWebshopCategory: {
        url: '/api/webshop/admin/categories/',
        method: 'POST'
    },
    deleteWebshopCategory: ({ id }: IDeleteWebshopCategoryRequestParams) => ({
        url: `/api/webshop/admin/categories/${id}/`,
        method: 'DELETE'
    })
};
