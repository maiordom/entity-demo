import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IRole } from '../models/Role';

interface IGetRolesResponse {
    data: Array<IRole>;
}

export const getRoles = () =>
    request.call(routes.roles.getRoles).then(({ data }: AxiosResponse<IGetRolesResponse>) => ({
        roles: (data.data || []).map(role => ({
            id: role.id,
            name: role.name,
            claims: role.claims
        }))
    }));

export default getRoles;
