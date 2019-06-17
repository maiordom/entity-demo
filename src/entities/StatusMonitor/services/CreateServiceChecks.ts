import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IServiceChecks } from '../models/ServiceChecks';

export interface ICreateServiceChecksRequestParams {
    value: IServiceChecks;
}

export const createServiceChecks = (params: ICreateServiceChecksRequestParams) =>
    request.call(routes.statusMonitor.createServiceChecks, params);

export default createServiceChecks;
