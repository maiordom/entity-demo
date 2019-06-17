import { IGetUserRolesRequestParams } from 'src/entities/Roles/services/GetUserRoles';
import { IAddUserRoleUrlParams } from 'src/entities/Roles/services/AddUserRole';
import { IDeleteUserRoleRequestParams } from 'src/entities/Roles/services/DeleteUserRole';
import { IDeleteRoleRequestParams } from 'src/entities/Roles/services/DeleteRole';

export default {
    getRoles: {
        method: 'GET',
        url: '/api/auth/admin/roles/'
    },
    addRole: {
        method: 'POST',
        url: '/api/auth/admin/roles/'
    },
    editRole: {
        url: '/api/auth/admin/roles/',
        method: 'PUT'
    },
    deleteRole: ({ roleId }: IDeleteRoleRequestParams) => ({
        method: 'DELETE',
        url: `/api/auth/admin/roles/${roleId}`
    }),
    addUserRole: ({ userId }: IAddUserRoleUrlParams) => ({
        method: 'POST',
        url: `/api/auth/admin/users/${userId}/roles/`
    }),
    getUserRoles: ({ userId }: IGetUserRolesRequestParams) => ({
        method: 'GET',
        url: `/api/auth/admin/users/${userId}/roles/`
    }),
    deleteUserRole: ({ userId, serviceId, roleId }: IDeleteUserRoleRequestParams) => ({
        url: `/api/auth/admin/users/${userId}/roles/services/${serviceId}/${roleId}/`,
        method: 'DELETE'
    })
};
