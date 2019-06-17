import { IRole } from './models/Role';
import { IUserRoles } from './models/UserRoles';
import { IUserRole } from './models/UserRole';
import { IAppsOptions } from 'src/entities/Apps/store';

export { IRole } from './models/Role';

export interface IRoles {
    roleService: 'NEW_ROLE',
    apps: IAppsOptions;
    userId: string;
    userRoles: Array<IUserRole>;
    deletedRoles: Array<IUserRole>;
    newRoles: Array<IUserRole>;
    rolesList: Array<IRole>;
    userRolesByService: IUserRoles;
    userRolesByType: IUserRoles;
};

export const roles: IRoles = {
    roleService: 'NEW_ROLE',
    apps: {
        items: [],
        selected: null
    },
    userId: null,
    newRoles: [],
    deletedRoles: [],
    userRoles: [],
    rolesList: null,
    userRolesByService: {},
    userRolesByType: {}
};
