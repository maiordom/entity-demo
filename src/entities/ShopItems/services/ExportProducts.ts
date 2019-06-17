import { webshopTransport } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export type IExportProductsRequestParams = {
    serviceId: string;
};

export interface IExportProductsResult {
    data: any;
}

export const exportProducts = (params: IExportProductsRequestParams) =>
    webshopTransport.call((routes.webshop.exportProducts as TRouteHandler)(params));

export default exportProducts;
