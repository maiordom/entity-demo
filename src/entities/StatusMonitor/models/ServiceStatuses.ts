export interface IServiceStatuses {
    serviceId: string;
    environment: string;
    servers: Array<{
        name: string;
        isAvailable: boolean;
    }>;
}
