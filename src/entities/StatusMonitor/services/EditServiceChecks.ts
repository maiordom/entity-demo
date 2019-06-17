import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IServiceChecks } from '../models/ServiceChecks';

export interface IEditServiceChecksRequestParams {
    value: IServiceChecks;
}

export const editServiceChecks = (params: IEditServiceChecksRequestParams) =>
    request.call(routes.statusMonitor.editServiceChecks, params);

export default editServiceChecks;
