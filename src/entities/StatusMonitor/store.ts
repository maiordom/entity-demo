import { IServiceStatuses } from './models/ServiceStatuses';
export { IServiceStatuses } from './models/ServiceStatuses';

import { IServerChecks } from './models/ServerChecks';

export type IServersChecks = {
    id: string;
    items: Array<IServerChecks>;
};
export type IServicesStatuses = Array<IServiceStatuses>;

export interface IStatusMonitor {
    servicesStatuses: IServicesStatuses;
    serversChecks: {
        [key: string]: IServersChecks;
    };
}

export const statusMonitor: IStatusMonitor = {
    servicesStatuses: [],
    serversChecks: {}
};
