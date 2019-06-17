import { IEventContext } from './models/EventContext';

export interface IUserEventAbstract {
    id: string;
    when: string;
    serviceId: string;
    eventType: string;
    userEvent: any;
    context: IEventContext;
}

export interface IUserEventContactHistory extends IUserEventAbstract {
    value: string | {
        old: string;
        new: string;
    };
    actionType: string;
    contactType: string;
}

export interface IEventsLog<T> {
    items: Array<T>;
    from: number;
    count: number;
    until?: string;
    since?: string;
    total: number;
    page?: number;
}

export type IUserContactEvents = IEventsLog<IUserEventContactHistory>;
export type IUserCommonEvents = IEventsLog<IUserEventAbstract>;

export interface IEvents {
    ban?: { [key: string]: IUserCommonEvents; };
    contacts?: { [key: string]: IUserContactEvents; };
    common?: { [key: string]: IUserCommonEvents; };
    promocodes?: { [key: string]: IUserCommonEvents; };
}

export const events: IEvents = {
    ban: {},
    contacts: {},
    common: {},
    promocodes: {}
};
