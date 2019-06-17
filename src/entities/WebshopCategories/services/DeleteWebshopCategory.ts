import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteWebshopCategoryRequestParams {
    id: string;
}

export const deleteWebshopCategory = (params: IDeleteWebshopCategoryRequestParams) =>
    request.call(
        (routes.webshopCategories.deleteWebshopCategory as TRouteHandler)(params)
    );

export default deleteWebshopCategory;
