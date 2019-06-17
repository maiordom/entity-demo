import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IServiceStatuses } from '../models/ServiceStatuses';

export interface IGetServicesStatusesResponse {
    data: Array<IServiceStatuses>;
}

export const getServicesStatuses = () =>
    request.call(
        routes.statusMonitor.getServicesStatuses
    ).then(({ data: { data } }: AxiosResponse<IGetServicesStatusesResponse>) => ({
        servicesStatuses: data.map(service => ({
            serviceId: service.serviceId,
            environment: service.environment,
            servers: service.servers.map(server => ({
                name: server.name,
                isAvailable: server.isAvailable
            }))
        }))
    }));

export default getServicesStatuses;
