import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IWebshopCategory } from '../models/WebshopCategory';

export interface IGetWebshopCategoriesRequestParams {
    serviceId: string;
}

export interface IGetWebshopCategoriesResponse {
    data: {
        items: Array<IWebshopCategory>;
    }
}

export const getWebshopCategories = (params: IGetWebshopCategoriesRequestParams) =>
    request.call(
        (routes.webshopCategories.getWebshopCategories as TRouteHandler)(params)
    ).then(({ data: { data: { items } } }: AxiosResponse<IGetWebshopCategoriesResponse>) => ({
        categories: items.map(item => ({
            id: item.id,
            name: {
                ru: item.name.ru,
                en: item.name.en,
                pt: item.name.pt
            },
            slug: item.slug,
            isHidden: item.isHidden,
            serviceId: item.serviceId,
            parentCategoryId: item.parentCategoryId
        }))
    }));

export default getWebshopCategories;
