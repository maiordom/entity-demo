import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IGetServiceChecksRequestParams {
    environment: string;
    serviceId: string;
}

import { IServiceChecks } from '../models/ServiceChecks';

export interface IGetServiceChecksResponse {
    data: IServiceChecks;
}

export const getServiceChecks = (params: IGetServiceChecksRequestParams) =>
    request.call(
        (routes.statusMonitor.getServiceChecks as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetServiceChecksResponse>) => ({
        id: data.id,
        environment: data.environment,
        serviceId: data.serviceId,
        serversChecks: data.serversChecks.map(serverChecks => ({
            name: serverChecks.name,
            checkMode: serverChecks.checkMode,
            checks: serverChecks.checks.map(check => check.type === 'tcp'
                ? {
                    name: check.name,
                    type: check.type,
                    host: check.host,
                    port: check.port
                }
                : {
                    name: check.name,
                    type: check.type,
                    url: check.url,
                    host: check.host,
                    method: check.method
                })
        }))
    }))

export default getServiceChecks;
