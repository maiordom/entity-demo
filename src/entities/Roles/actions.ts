import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IStore } from 'src/store';

import { IRole } from './models/Role';
import { IUserRole } from './models/UserRole';
import { IOption } from 'src/entities/Apps/store';

import getUserRolesService, { IGetUserRolesRequestParams }  from './services/GetUserRoles';
export { IGetUserRolesRequestParams }  from './services/GetUserRoles';
import addUserRoleService, { IAddUserRoleRequestParams } from './services/AddUserRole';
import deleteUserRoleService, { IDeleteUserRoleRequestParams } from './services/DeleteUserRole';
import addRoleService from './services/AddRole';
import editRoleService from './services/EditRole';
import deleteRoleService, { IDeleteRoleRequestParams } from './services/DeleteRole';
export { IDeleteRoleRequestParams } from './services/DeleteRole';

export interface ISetRolesParams { roles: Array<IRole>; };
export interface ISetRolesAction extends IAction<ISetRolesParams> {};

export interface ISetServiceParams { option: IOption; }
export interface ISetServiceAction extends IAction<ISetServiceParams> {}

export interface ISetUserRolesParams { userId: string; roles: Array<IUserRole>; }
export interface ISetUserRolesAction extends IAction<ISetUserRolesParams> {}

export interface ISetRoleParams { checked: boolean; serviceKey: string; role: string; }
export interface ISetRoleAction extends IAction<ISetRoleParams> {}

export interface IAddRoleParams { roleName: string; }
export interface IEditRoleParams { id: number; name: string; }

export const {
    setRolesDiff,
    setRoles,
    setRole,
    setUserRoles,
    setService,
    setServices
} = {
    setRolesDiff: () => createAction('setRolesDiff'),
    setRoles: (params: ISetRolesParams) => createAction('setRoles', params),
    setRole: (params: ISetRoleParams) => createAction('setRole', params),
    setUserRoles: (params: ISetUserRolesParams) => createAction('setUserRoles', params),
    setService: (params: ISetServiceParams) => createAction('setService', params),
    setServices: () => createAction('setServices')
};

import getRolesService from './services/GetRoles';

export const getRoles = () => (dispatch) =>
    getRolesService().then(({ roles }) => {
        dispatch(setRoles({ roles }));
    });

export const getUserRoles = (params: IGetUserRolesRequestParams) => async (dispatch) => {
    const { roles } = await getUserRolesService(params);

    dispatch(setUserRoles({ roles, userId: params.userId }));
};

export const addUserRole = (params: IAddUserRoleRequestParams) =>
    addUserRoleService(params);

export const deleteUserRole = (params: IDeleteUserRoleRequestParams) =>
    deleteUserRoleService(params);

export const applyUserRoles = () => (dispatch, getState: () => IStore) => {
    dispatch(setRolesDiff());

    const promises = [];

    const { userId } = getState().roles;
    const { newRoles, deletedRoles } = getState().roles;

    newRoles.forEach(role => {
        promises.push(addUserRole({
            userId,
            roleName: role.type,
            roleId: role.roleId,
            serviceId: role.value
        }));
    });

    deletedRoles.forEach(role => {
        promises.push(deleteUserRole({
            userId,
            roleName: role.type,
            roleId: role.roleId,
            serviceId: role.value
        }));
    });

    return Promise.all(promises);
};

export const addRole = (params: IAddRoleParams) => (dispatch, getState: () => IStore) => {
    const state = getState();
    const claims = state.claims.claimsByService[state.roles.roleService];

    return addRoleService({
        name: params.roleName,
        claims
    });
};

export const editRole = (params: IEditRoleParams) => (dispatch, getState: () => IStore) => {
    const state = getState();
    const claims = state.claims.claimsByService[state.roles.roleService];

    return editRoleService({
        ...params,
        claims
    });
};

export const deleteRole = (params: IDeleteRoleRequestParams) => () =>
    deleteRoleService(params);
