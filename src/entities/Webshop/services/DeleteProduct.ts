import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteProductRequestParams {
    id: number;
}

export const deleteProduct = (params: IDeleteProductRequestParams) => (
    request.call(
        (routes.webshop.deleteProduct as TRouteHandler)(params)
    )
);

export default deleteProduct;
