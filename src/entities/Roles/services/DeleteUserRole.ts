import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteUserRoleRequestParams {
    userId: string;
    serviceId: string;
    roleId: string;
    roleName: string;
}

const deleteUserRole = (params: IDeleteUserRoleRequestParams) =>
    request.call(
        (routes.roles.deleteUserRole as TRouteHandler)(params as any)
    );

export default deleteUserRole;
