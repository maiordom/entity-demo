import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IGetUserRolesRequestParams {
    userId: string;
}

interface IGetUserRolesResponse {
    data: Array<{
        roleId: string;
        serviceId: string;
        roleName: string;
    }>;
}

export const getRoles = (params: IGetUserRolesRequestParams) =>
    request.call(
        (routes.roles.getUserRoles as TRouteHandler)(params)
    ).then(({ data }: AxiosResponse<IGetUserRolesResponse>) => ({
        roles: data.data ? data.data.map(role => ({
            roleId: role.roleId,
            value: role.serviceId,
            type: role.roleName
        })) : []
    }));

export default getRoles;
