import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IGetProductRequestParams {
    productId: number;
};

import { IProduct } from '../store';

export interface IGetProductResponse {
    data: IProduct;
}

export type IGetProductResult = IProduct;

export const getProduct = (params: IGetProductRequestParams) =>
    request.call((routes.webshop.getProduct as TRouteHandler)(params)).then(
        ({ data: { data } }: AxiosResponse<IGetProductResponse>
    ): IProduct => ({
        id: data.id,
        slug: data.slug,
        serviceId: data.serviceId,
        price: data.price,
        referencePrice: data.referencePrice,
        name: data.name,
        description: data.description
    })).catch(() => null);

export default getProduct;
