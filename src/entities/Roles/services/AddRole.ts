import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IRole } from '../models/Role';

export interface IAddRoleRequestParams extends IRole {}

export const addRole = (params: IAddRoleRequestParams) =>
    request.call(routes.roles.addRole, { value: params });

export default addRole;
