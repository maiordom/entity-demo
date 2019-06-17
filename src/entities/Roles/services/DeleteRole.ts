import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteRoleRequestParams {
    roleId: string;
}

export const deleteRole = (params: IDeleteRoleRequestParams) =>
    request.call((routes.roles.deleteRole as TRouteHandler)(params));

export default deleteRole;
