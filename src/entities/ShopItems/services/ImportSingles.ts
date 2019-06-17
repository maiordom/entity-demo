import { webshopTransport } from 'src/utils/Request';
import routes, { TRouteHandler, TImportType } from 'src/routes/api';

export { TImportType } from 'src/routes/api';

export type IImportSinglesRequestParams = {
    serviceId: string;
    file: File;
};

export const importSingles = (
    { file, serviceId }: IImportSinglesRequestParams,
    type: TImportType
) => {
    const data = new FormData();

    data.set('Data', file);

    return webshopTransport.call(
        (routes.webshop.importSingles as TRouteHandler)({ serviceId, type }), data
    );
};

export default importSingles;
