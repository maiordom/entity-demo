import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import getEventsService, { IGetEventsRequestParams } from './services/GetEvents';
export { IGetEventsRequestParams } from './services/GetEvents';

import { IUserEventContactHistory, IUserEventAbstract } from './store';

export interface ISetEventsParams { since?: string; until?: string; from: number; count: number; total: number; type: string; userId: string; events: Array<IUserEventContactHistory | IUserEventAbstract>; }
export interface ISetEventsAction extends IAction<ISetEventsParams> {}

export interface ISetSettingsParams { page?: number; since?: string; until?: string; type: string; userId: string; }
export interface ISetSettingsAction extends IAction<ISetSettingsParams> {}

export const {
    setEvents,
    setSettings
} = {
    setEvents: (params: ISetEventsParams) => createAction('setEvents', params),
    setSettings: (params: ISetSettingsParams) => createAction('setSettings', params)
};

export const getPromoCodeActivations = (params: IGetEventsRequestParams) => (dispatch) => {
    params.eventType = [
        'users.promocodes.activated'
    ];

    return getEvents(params, 'promocodes')(dispatch);
};

export const getBanEvents = (params: IGetEventsRequestParams) => (dispatch) => {
    params.eventType = [
        'users.accounts.unbanned',
        'users.accounts.banned'
    ];

    return getEvents(params, 'ban')(dispatch);
};

export const getContactsHistory = (params: IGetEventsRequestParams) => async (dispatch) => {
    params.eventType = [
        'users.phone.added',
        'users.phone.changed',
        'users.phone.deleted',
        'users.email.added',
        'users.email.changed',
        'users.email.deleted',
        'users.login.added',
        'users.login.changed',
        'users.login.deleted',
        'users.socials.added',
        'users.socials.deleted'
    ];

    const { events: rawEvents, total } = await getEventsService(params);

    const events: Array<IUserEventContactHistory> = rawEvents.map(event => ({
        ...event,
        value: event.userEvent.socialNetwork || event.userEvent.value,
        actionType: /(added|changed|deleted)$/.exec(event.eventType)[1],
        contactType: /.*\.(.*)\..*/.exec(event.eventType)[1]
    }));

    dispatch(setEvents({
        type: 'contacts',
        userId: params.userId,
        until: params.until,
        since: params.since,
        events,
        from: params.from,
        count: params.count,
        total
    }));
};

export const getEvents = (params: IGetEventsRequestParams, type?: string) => async (dispatch) => {
    const { events, total } = await getEventsService(params);

    dispatch(setEvents({
        type: type || 'common',
        userId: params.userId,
        until: params.until,
        since: params.since,
        events,
        from: params.from,
        count: params.count,
        total
    }));

    return events;
};
