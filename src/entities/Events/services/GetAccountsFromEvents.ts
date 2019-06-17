import { AxiosResponse } from 'axios';
import format from 'date-fns/format';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IEventContext } from '../models/EventContext';
import { IUserEvent } from '../models/UserEvent';

export interface IGetAccountsFromEventsRequestParams {
    value: string;
    contactType: string;
    from: number;
    count: number;
}

interface IGetAccountsFromEventsResponse {
    data: {
        items: Array<{
            context: IEventContext;
            userEvent: IUserEvent;
        }>;
        total: number;
    };
}

export interface IAccountByContactHistoryEvent extends IUserEvent {
    context: IEventContext;
};

export interface IGetAccountsFromEventsResult {
    events: Array<IAccountByContactHistoryEvent>;
}

export const getAccountsFromEvents = (
    params: IGetAccountsFromEventsRequestParams
): Promise<IGetAccountsFromEventsResult> =>
    request.call(
        (routes.events.getAccountsFromEvents as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetAccountsFromEventsResponse>) => ({
        events: data.items.map(({ userEvent, context }) => ({
            when: format(userEvent.when, 'YYYY-MM-DD HH:mm'),
            serviceId: userEvent.serviceId,
            type: userEvent.type,
            userId: String(userEvent.userId),
            value: userEvent.value,
            context
        }))
    })).catch(() => ({
        events: []
    }));

export default getAccountsFromEvents;
