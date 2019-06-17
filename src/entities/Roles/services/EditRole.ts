import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IRole } from '../models/Role';

export interface IEditRoleRequestParams extends IRole {}

export const editRole = (params: IEditRoleRequestParams) =>
    request.call(routes.roles.editRole, { value: params });

export default editRole;
