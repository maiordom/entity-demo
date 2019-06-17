import qs from 'qs';

import { IGetAccountsFromEventsRequestParams } from 'src/entities/Events/services/GetAccountsFromEvents';
import { IGetEventsRequestParams } from 'src/entities/Events/services/GetEvents';
import { IGetPresetsParams } from 'src/entities/EventFilters/services/GetPresets';
import { IRemovePreset } from 'src/entities/EventFilters/services/RemovePreset';

export default {
    getEvents: ({ userId, ...queryParams }: IGetEventsRequestParams) => ({
        url: `/api/eventstore/users/${userId}/events?${qs.stringify(queryParams, { indices: false })}`,
        method: 'GET'
    }),
    getAccountsFromEvents: ({ contactType, value }: IGetAccountsFromEventsRequestParams) => ({
        url: `/api/eventstore/events/contacts/${contactType}/${value}`,
        method: 'GET'
    }),
    getEventsList: {
        url: '/api/eventstore/groups/',
        method: 'GET'
    },
    addPreset: {
        url: '/api/eventstore/presets/',
        method: 'POST'
    },
    getPresets: ({ userId }: IGetPresetsParams) => ({
        url: `/api/eventstore/users/${userId}/presets/`,
        method: 'GET'
    }),
    removePreset: ({ id }: IRemovePreset) => ({
        url: `/api/eventstore/presets/${id}/`,
        method: 'DELETE'
    }),
    savePreset: {
        url: '/api/eventstore/presets/',
        method: 'PUT'
    },
};
