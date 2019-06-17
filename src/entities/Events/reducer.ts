import { handleActions } from 'redux-actions';

import * as a from './actions';
import { IStore } from 'src/store';

import {
    ISetEventsAction,
    ISetSettingsAction
} from './actions';

export default handleActions({
    [a.setSettings.name]: (state: IStore, { payload: { since, until, type, userId, page }}: ISetSettingsAction) => {
        const changes = { since, until, page };
        Object.assign(state.events[type][userId], Object
            .keys(changes)
            .filter(key => changes[key] !== undefined)
            .reduce((result, key) => { result[key] = changes[key]; return result; }, {})
        );

        return state;
    },

    [a.setEvents.name]: (state: IStore, { payload: { since, until, type, userId, events, from, count, total } }: ISetEventsAction) => {
        state.events[type] ? null : state.events[type] = {};
        state.events[type][userId] = {
            page: Math.ceil(from / count),
            since,
            until,
            items: events,
            from,
            count,
            total
        };

        return state;
    }
}, {});