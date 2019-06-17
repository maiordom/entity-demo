import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IWebshopCategory } from '../models/WebshopCategory';

export interface IEditWebshopCategoryRequestParams {
    value: IWebshopCategory;
}

export const editWebshopCategory = (params: IEditWebshopCategoryRequestParams) =>
    request.call(routes.webshopCategories.editWebshopCategory, params);

export default editWebshopCategory;
