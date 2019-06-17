import { getJob, IGetJobRequestParams, IGetJobResult } from 'src/entities/Jobs/actions';
export { IGetJobResult } from 'src/entities/Jobs/actions';

import prolongManySubscriptionsService, { IProlongManySubscriptionsRequestParams } from './services/ProlongManySubscriptions';
export { IProlongManySubscriptionsRequestParams } from './services/ProlongManySubscriptions';

import prolongSubscriptionService, { IProlongSubscriptionRequestParams } from './services/ProlongSubscription';
export { IProlongSubscriptionRequestParams } from './services/ProlongSubscription';

import { setGameAccountSubscription } from 'src/entities/GameAuth/actions';

import { checkJob } from 'src/entities/Jobs/actions';

export const prolongManySubscriptions = (params: IProlongManySubscriptionsRequestParams) => async (): Promise<IGetJobResult> => {
    const { status, id } = await prolongManySubscriptionsService(params);

    return checkJob({ id, toPartnerId: params.toPartnerId });
};

export const prolongSubscription = (userId: string, params: IProlongSubscriptionRequestParams) => async (dispatch) => {
    const { until } = await prolongSubscriptionService(params);

    dispatch(setGameAccountSubscription({
        userId,
        login: params.login,
        until
    }));
};