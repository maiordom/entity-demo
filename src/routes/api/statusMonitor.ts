import { IGetServiceChecksRequestParams } from 'src/entities/StatusMonitor/services/GetServiceChecks';
import { IRemoveServiceChecksRequestParams } from 'src/entities/StatusMonitor/services/RemoveServiceChecks';

export default {
    getServicesStatuses: {
        url: '/api/statusmonitor/public/statuses/',
        method: 'GET'
    },
    getServiceChecks: ({ environment, serviceId }: IGetServiceChecksRequestParams) => ({
        url: `/api/statusmonitor/admin/checks/${environment}/${serviceId}/`,
        method: 'GET'
    }),
    editServiceChecks: {
        url: '/api/statusmonitor/admin/checks',
        method: 'PUT'
    },
    createServiceChecks: {
        url: '/api/statusmonitor/admin/checks',
        method: 'POST'
    },
    removeServiceChecks: ({ id }: IRemoveServiceChecksRequestParams) => ({
        url: `/api/statusmonitor/admin/checks/${id}/`,
        method: 'DELETE'
    })
};
