import { webshopTransport } from 'src/utils/Request';
import routes, { TRouteHandler, TImportType } from 'src/routes/api';

export { TImportType } from 'src/routes/api';

export type IImportProductsRequestParams = {
    serviceId: string;
    file: File;
};

export const importProducts = (
    { file, serviceId }: IImportProductsRequestParams,
    type: TImportType
) => {
    const data = new FormData();

    data.set('Data', file);

    return webshopTransport.call(
        (routes.webshop.importProducts as TRouteHandler)({ serviceId, type }), data
    );
};

export default importProducts;
