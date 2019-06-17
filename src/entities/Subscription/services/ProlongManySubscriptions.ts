import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import { IReason } from 'src/types/IReason';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IProlongManySubscriptionsRequestParams {
    logins: Array<string>;
    reason: IReason;
    days: number;
    toPartnerId: string;    
}

export interface IProlongManySubscriptionsResponse {
    data: {
        id: string;
        status: string;
    };
}

export const prolongManySubscriptions = (params: IProlongManySubscriptionsRequestParams) =>
    request.call(
        routes.subscription.prolongManySubscriptions, params
    ).then(({ data: { data: { status, id } } }: AxiosResponse<IProlongManySubscriptionsResponse>) => ({
        id,
        status
    }));

export default prolongManySubscriptions;
