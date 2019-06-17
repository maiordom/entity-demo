import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IProfile } from '../store';

export interface IGetProfileResponse {
    data: {
        id: number;
        username: string;
        email: string;
    };
}

export const getProfile = () =>
    request.call(routes.admin.getProfile).then(
        ({ data: { data }}: AxiosResponse<IGetProfileResponse>
    ): IProfile => ({
        userId: String(data.id),
        username: data.username,
        email: data.email
    }));

export default getProfile;