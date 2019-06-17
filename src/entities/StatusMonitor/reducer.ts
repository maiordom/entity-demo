import { handleActions } from 'redux-actions';
import sortBy from 'lodash/sortBy';

import * as a from './actions';
import { IStore } from 'src/store';


import {
    IEditServerAction,
    ICreateServerAction,
    ISetServicesStatusesAction,
    ISetServiceChecksAction,
    ICreateServerCheckAction,
    IEditServerCheckAction,
    IRemoveServerCheckAction,
    IRemoveServerAction
} from './actions';

export default handleActions({
    [a.removeServer.name]: (state: IStore, { payload: { serverChecks, environment, serviceId } }) => {
        state.statusMonitor = {...state.statusMonitor};

        const serversChecksKey = `${environment}_${serviceId}`;
        const serversChecks = state.statusMonitor.serversChecks[serversChecksKey];

        serversChecks.items = serversChecks.items.filter(item => item !== serverChecks);
        state.statusMonitor.serversChecks[serversChecksKey] = {...serversChecks};

        return state;
    },

    [a.removeServerCheck.name]: (state: IStore, { payload: { serverChecks, environment, serviceId, serverCheck } }: IRemoveServerCheckAction) => {
        state.statusMonitor = {...state.statusMonitor};

        const serversChecksKey = `${environment}_${serviceId}`;
        const serversChecks = state.statusMonitor.serversChecks[serversChecksKey];

        serverChecks.checks = serverChecks.checks.filter(check => check !== serverCheck);
        state.statusMonitor.serversChecks[serversChecksKey] = {...serversChecks};

        return state;
    },

    [a.editServer.name]: (state: IStore, { payload: { serverChecks, serviceId, changes, environment } }: IEditServerAction) => {
        state.statusMonitor = {...state.statusMonitor};

        const serversChecksKey = `${environment}_${serviceId}`;
        const serversChecks = state.statusMonitor.serversChecks[serversChecksKey];

        Object.assign(serverChecks, changes);

        state.statusMonitor.serversChecks[serversChecksKey] = {...serversChecks};

        return state;
    },

    [a.setServicesStatuses.name]: (state: IStore, { payload: { servicesStatuses } }: ISetServicesStatusesAction) => {
        state.statusMonitor = {...state.statusMonitor};
        state.statusMonitor.servicesStatuses = sortBy(servicesStatuses, ['serviceId', 'environment']);

        return state;
    },

    [a.setServiceChecks.name]: (state: IStore, { payload: { id, serviceId, serversChecks, environment } }: ISetServiceChecksAction) => {
        state.statusMonitor = {...state.statusMonitor};
        state.statusMonitor.serversChecks[`${environment}_${serviceId}`] = { id, items: serversChecks };
        return state;
    },

    [a.createServer.name]: (state: IStore, { payload: { serverName, environment, serviceId, checkMode } }: ICreateServerAction ) => {
        state.statusMonitor = {...state.statusMonitor};

        const serversChecksKey = `${environment}_${serviceId}`;
        const serversChecks = state.statusMonitor.serversChecks[serversChecksKey];

        serversChecks.items.push({ name: serverName, checkMode, checks: [] });
        state.statusMonitor.serversChecks[serversChecksKey] = {...serversChecks};

        return state;
    },

    [a.createServerCheck.name]: (state: IStore, { payload: { serverChecks, environment, serviceId, serverCheck } }: ICreateServerCheckAction) => {
        state.statusMonitor = {...state.statusMonitor};

        const serversChecksKey = `${environment}_${serviceId}`;
        const serversChecks = state.statusMonitor.serversChecks[serversChecksKey];

        serverChecks.checks.push(serverCheck);
        state.statusMonitor.serversChecks[serversChecksKey] = {...serversChecks};

        return state;
    },

    [a.editServerCheck.name]: (state: IStore, { payload: { serverChecks, environment, serviceId, oldServerCheck, newServerCheck } }: IEditServerCheckAction) => {
        state.statusMonitor = {...state.statusMonitor};

        const serversChecksKey = `${environment}_${serviceId}`;
        const serversChecks = state.statusMonitor.serversChecks[serversChecksKey];

        serverChecks.checks = serverChecks.checks.map(check =>
            check === oldServerCheck ? newServerCheck : check
        );
        state.statusMonitor.serversChecks[serversChecksKey] = {...serversChecks};

        return state;
    }
}, {});
