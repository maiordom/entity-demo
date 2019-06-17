import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IAddUserRoleUrlParams {
    userId: string;
}

export interface IAddUserRoleRequestParams {
    userId: string;
    serviceId: string;
    roleId: string;
    roleName: string;
}

const addUserRole = (params: IAddUserRoleRequestParams) =>
    request.call(
        (routes.roles.addUserRole as TRouteHandler)({ userId: params.userId }), { value: params }
    );

export default addUserRole;
