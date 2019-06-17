import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IRegistrationContext } from '../models/RegistrationContext';

export interface IGetRegistrationContextRequestParams {
    userId: string;
}

export interface IGetRegistrationContextResponse {
    data: IRegistrationContext;
}

export const getRegistrationContext = (params: IGetRegistrationContextRequestParams) =>
    request.call(
        (routes.auth.getRegistrationContext as TRouteHandler)(params)
    ).then(({ data: { data: { ip } } }: AxiosResponse<IGetRegistrationContextResponse>) => ({
        ip
    }));

export default getRegistrationContext;
