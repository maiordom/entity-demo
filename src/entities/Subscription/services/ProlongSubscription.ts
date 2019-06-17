import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import { IReason } from 'src/types/IReason';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IProlongSubscriptionRequestParams {
    login: string;
    reason: IReason;
    days: number;
    toPartnerId: string;    
}

export interface IProlongSubscriptionResponse {
    data: {
        until: string;
    };
}

export const prolongSubscription = (params: IProlongSubscriptionRequestParams) =>
    request.call(
        routes.subscription.prolongSubscription, params
    ).then(({ data: { data: { until } } }: AxiosResponse<IProlongSubscriptionResponse>) => ({
        until: moment(until).utc().format('YYYY-MM-DD HH:mm')
    }));

export default prolongSubscription;