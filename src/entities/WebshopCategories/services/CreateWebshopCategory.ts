import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IWebshopCategory } from '../models/WebshopCategory';

export interface ICreateWebshopCategoryRequestParams {
    value: IWebshopCategory;
}

export const createWebshopCategory = (params: ICreateWebshopCategoryRequestParams) =>
    request.call(routes.webshopCategories.createWebshopCategory, params);

export default createWebshopCategory;
