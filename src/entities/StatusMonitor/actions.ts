import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IStore } from 'src/store';

import { ICheckMode } from './models/ServerChecks';
import { IServicesStatuses, IServersChecks } from './store';
import { IServerChecks, IServerCheck } from './models/ServerChecks';

import getServicesStatusesService from './services/GetServicesStatuses';

import getServiceChecksService, { IGetServiceChecksRequestParams } from './services/GetServiceChecks';
export { IGetServiceChecksRequestParams } from './services/GetServiceChecks';

import editServiceChecksService, { IEditServiceChecksRequestParams } from './services/EditServiceChecks';
export interface IEditServiceChecksParams { serversChecks: IServersChecks; serviceId: string; environment: string; }

import createServiceChecksService, { ICreateServiceChecksRequestParams } from './services/CreateServiceChecks';
export interface ICreateServiceChecksParams { serversChecks: IServersChecks; serviceId: string; environment: string; }

import removeServiceChecksService, { IRemoveServiceChecksRequestParams } from './services/RemoveServiceChecks';
export { IRemoveServiceChecksRequestParams } from './services/RemoveServiceChecks';

export interface ISetServicesStatusesParams { servicesStatuses: IServicesStatuses; }
export interface ISetServicesStatusesAction extends IAction<ISetServicesStatusesParams> {}

export interface ISetServiceChecksParams { id: string; serviceId: string; environment: string; serversChecks: Array<IServerChecks>; }
export interface ISetServiceChecksAction extends IAction<ISetServiceChecksParams> {}

export interface ICreateServerCheckParams { serverChecks: IServerChecks; serviceId: string; environment: string; serverCheck: IServerCheck; }
export interface ICreateServerCheckAction extends IAction<ICreateServerCheckParams> {}

export interface ICreateServerParams { serverName: string; serviceId: string; environment: string; checkMode: ICheckMode; }
export interface ICreateServerAction extends IAction<ICreateServerParams> {}

export interface IEditServerCheckParams { serverChecks: IServerChecks; serviceId: string; environment: string; oldServerCheck: IServerCheck; newServerCheck: IServerCheck; }
export interface IEditServerCheckAction extends IAction<IEditServerCheckParams> {}

export interface IEditServerParams { serviceId: string; environment: string; serverChecks: IServerChecks; changes: { name?: string; checkMode?: ICheckMode; } }
export interface IEditServerAction extends IAction<IEditServerParams> {}

export interface IRemoveServerCheckParams { serverChecks: IServerChecks; serverCheck: IServerCheck; serviceId: string; environment: string; }
export interface IRemoveServerCheckAction extends IAction<IRemoveServerCheckParams> {}

export interface IRemoveServerParams { serverChecks: IServerChecks; serviceId: string; environment: string; }
export interface IRemoveServerAction extends IAction<IRemoveServerParams> {}

export const {
    setServicesStatuses,
    setServiceChecks,
    createServerCheck,
    createServer,
    editServerCheck,
    editServer,
    removeServerCheck,
    removeServer
} = {
    setServicesStatuses: (params: ISetServicesStatusesParams) => createAction('setServicesStatuses', params),
    setServiceChecks: (params: ISetServiceChecksParams) => createAction('setServiceChecks', params),
    createServerCheck: (params: ICreateServerCheckParams) => createAction('createServerCheck', params),
    createServer: (params: ICreateServerParams) => createAction('createServer', params),
    editServerCheck: (params: IEditServerCheckParams) => createAction('editServerCheck', params),
    editServer: (params: IEditServerParams) => createAction('editServer', params),
    removeServerCheck: (params: IRemoveServerCheckParams) => createAction('removeServerCheck', params),
    removeServer: (params: IRemoveServerParams) => createAction('removeServer', params)
};

export const getServicesStatuses = () => async (dispatch) => {
    const { servicesStatuses } = await getServicesStatusesService();

    dispatch(setServicesStatuses({ servicesStatuses }));
};

export const removeServiceChecks = (params: IRemoveServiceChecksRequestParams ) => () =>
    removeServiceChecksService(params);

export const getServiceChecks = (params: IGetServiceChecksRequestParams) => async (dispatch) => {
    const { id, serversChecks, environment, serviceId } = await getServiceChecksService(params);

    dispatch(setServiceChecks({
        id,
        serviceId,
        environment,
        serversChecks
    }));
};

export const editServiceChecks = (params: IEditServiceChecksParams) => () => {
    const { serviceId, environment, serversChecks: { id, items } } = params;

    const requestParams: IEditServiceChecksRequestParams = {
        value: {
            id,
            serviceId,
            environment,
            serversChecks: items
        }
    };

    return editServiceChecksService(requestParams);
};

export const createServiceChecks = (params: ICreateServiceChecksParams) => () => {
    const { serviceId, environment, serversChecks: { items } } = params;

    const requestParams: ICreateServiceChecksRequestParams = {
        value: {
            serviceId,
            environment,
            serversChecks: items
        }
    };

    return createServiceChecksService(requestParams);
};
