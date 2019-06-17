import { IServerChecks } from './ServerChecks';

export interface IServiceChecks {
    id?: string;
    serviceId: string;
    environment: string;
    serversChecks: Array<IServerChecks>;
}
