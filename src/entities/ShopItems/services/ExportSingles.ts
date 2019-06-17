import { webshopTransport } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export type IExportSinglesRequestParams = {
    serviceId: string;
};

export interface IExportSinglesResult {
    data: any;
}

export const exportSingles = (params: IExportSinglesRequestParams) =>
    webshopTransport.call((routes.webshop.exportSingles as TRouteHandler)(params));

export default exportSingles;
