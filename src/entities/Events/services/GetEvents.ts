import { AxiosResponse } from 'axios';
import format from 'date-fns/format';
import uuid from 'uuid/v4';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { DATE_LONG_FORMAT } from 'src/constants';

import { IEventContext } from '../models/EventContext';

export interface IGetEventsRequestParams {
    userId: string;
    from: number;
    count: number;
    since?: string;
    until?: string;
    eventType?: Array<string>;
}

export type IUserEvent = any;

export interface IGetEventsResponse {
    data: {
        items: Array<{
            userEvent: IUserEvent;
            context: IEventContext;
        }>;
        total: number;
    };
}

export const getEvents = (params: IGetEventsRequestParams) =>
    request.call(
        (routes.events.getEvents as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetEventsResponse>) => ({
        total: data.total,
        events: data.items.map(({ userEvent, context }) => ({
            id: uuid(),
            when: format(userEvent.when, DATE_LONG_FORMAT),
            serviceId: userEvent.serviceId,
            eventType: userEvent.type,
            userId: userEvent.userId,
            context,
            userEvent
        }))
    }));

export default getEvents;
