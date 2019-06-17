import { AxiosResponse } from 'axios';
import format from 'date-fns/format';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IEmission } from '../models/Emission';

export { IEmission } from '../models/Emission';

export interface IGetEmissionsRequestParams {
    serviceId: string;
    from?: number;
    count: number;
}

export interface IGetEmissionsResponse {
    data: {
        items: Array<IEmission>;
        total: number;
    };
}

const getEmissions = (params: IGetEmissionsRequestParams) =>
    request.call(
        (routes.codes.getEmissions as TRouteHandler)(params as any)
    ).then((
        { data: { data } }: AxiosResponse<IGetEmissionsResponse>
    ) => ({
        items: data.items.map(item => ({
            id: item.id,
            name: item.name,
            whenCreated: format(item.whenCreated, 'YYYY-MM-DD HH:mm'),
            issuedBy: item.issuedBy
        })),
        total: data.total
    }));

export default getEmissions;
