import { handleActions } from 'redux-actions';
import reject from 'lodash/reject';
import forEach from 'lodash/forEach';
import differenceWith from 'lodash/differenceWith';
import find from 'lodash/find';

import * as a from './actions';
import { IStore } from 'src/store';

import { IUserRoles } from './models/UserRoles';
import { IUserRole } from './models/UserRole';
import { IRole } from './models/Role';

import { filterApp } from 'src/entities/Apps/reducer';

import {
    ISetRolesAction,
    ISetServiceAction,
    ISetUserRolesAction
} from './actions';

export default handleActions({
    [a.setRoles.name]: (state: IStore, { payload: { roles } }: ISetRolesAction) => {
        state.roles = {...state.roles};
        state.roles.rolesList = roles;

        return state;
    },

    [a.setUserRoles.name]: (state: IStore, { payload: { roles, userId } }: ISetUserRolesAction) => {
        const { rolesList } = state.roles;
        const area = state.area.selected.id;
        const areasKeys = [ state.area.selected.id ];

        state.roles = {...state.roles};

        roles.forEach(role => {
            role.type = find(rolesList, { id: role.roleId }).name;
        });

        const userRolesByService: IUserRoles = {};
        const userRolesByType: IUserRoles = {};

        roles = roles
            .filter(role => filterApp(role.value, area, areasKeys))
            .sort((a, b) => {
                if (a.value < b.value) return -1;
                if (a.value > b.value) return 1;
                return 0;
            });

        roles.forEach(role => {
            const { value, type } = role;

            if (value in userRolesByService) {
                userRolesByService[value].push(type);
            } else {
                userRolesByService[value] = [type];
            }

            if (type in userRolesByType) {
                userRolesByType[type].push(value);
            } else {
                userRolesByType[type] = [value];
            }
        });

        state.roles.userId = userId;
        state.roles.userRolesByService = userRolesByService;
        state.roles.userRolesByType = userRolesByType;
        state.roles.userRoles = roles;

        return state;
    },

    [a.setService.name]: (state: IStore, { payload: { option }}: ISetServiceAction) => {
        state.roles = {...state.roles};
        state.roles.userRolesByService[option.id] = [];

        const rolesByService: IUserRoles = {};
        Object.keys(state.roles.userRolesByService).sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        }).forEach((key) => {
            rolesByService[key] = state.roles.userRolesByService[key];
        });
        state.roles.userRolesByService = rolesByService;
        state.roles.apps.items = reject(state.roles.apps.items, { id: option.id });

        return state;
    },

    [a.setServices.name]: (state: IStore) => {
        state.roles = {...state.roles};

        const services = Object.keys(state.roles.userRolesByService);
        const area = state.area.selected.id;
        const areasKeys = [ state.area.selected.id ];

        const availableApps = Object
            .keys(state.apps)
            .filter(app => filterApp(app, area, areasKeys))
            .filter(app => !services.includes(app));

        state.roles.apps = {
            items: availableApps.map(app => ({
                id: state.apps[app].id,
                value: state.apps[app].name
            })),
            selected: null
        };

        return state;
    },

    [a.setRolesDiff.name]: (state: IStore) => {
        const { userRolesByType, userRoles: originalUserRoles, rolesList } = state.roles;
        const rolesDiff = {};
        const userRoles: Array<IUserRole> = [];

        forEach(userRolesByType, (services, roleName) => {
            services.forEach(service => {
                const role: IRole = find(rolesList, { name: roleName });

                userRoles.push({
                    roleId: String(role.id),
                    type: roleName,
                    value: service
                });
            });
        });

        const diffWithIterator = (originClaim, currentClaim) =>
            originClaim.type === currentClaim.type && originClaim.value === currentClaim.value;

        const deletedRoles: Array<IUserRole> = differenceWith(originalUserRoles, userRoles, diffWithIterator);
        const newRoles: Array<IUserRole> = differenceWith(userRoles, originalUserRoles, diffWithIterator);

        state.roles.deletedRoles = deletedRoles;
        state.roles.newRoles = newRoles;

        return state;
    },

    [a.setRole.name]: (state: IStore, { payload: {
        checked,
        serviceKey,
        role
    }}) => {
        state.roles = {...state.roles};

        const { userRolesByService, userRolesByType } = state.roles;

        if (checked) {
            if (!userRolesByService[serviceKey]) {
                userRolesByService[serviceKey] = [role];
            } else {
                userRolesByService[serviceKey].push(role);
            }

            if (!userRolesByType[role]) {
                userRolesByType[role] = [serviceKey];
            } else {
                userRolesByType[role].push(serviceKey);
            }
        } else {
            const claimIndexByService = userRolesByService[serviceKey].indexOf(role);
            const serviceIndexByType = userRolesByType[role].indexOf(serviceKey);

            userRolesByService[serviceKey].splice(claimIndexByService, 1);
            userRolesByType[role].splice(serviceIndexByType, 1);
        }

        return state;
    },

}, {});