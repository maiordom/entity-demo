import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IRemoveServiceChecksRequestParams {
    id: string;
}

export const removeServiceChecks = (params: IRemoveServiceChecksRequestParams) =>
    request.call((routes.statusMonitor.removeServiceChecks as TRouteHandler)(params));

export default removeServiceChecks;
