import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IGetJobRequestParams {
    id: string;
    toPartnerId: string;
}

type IStatus = 'scheduled' | 'competed';
type IFailed = {
    [key: string]: string;
};

export interface IGetJobResponse {
    data: {
        status: IStatus;
        data: {
            failed: IFailed;
        };
    };
}

export interface IGetJobResult {
    status: IStatus;
    failed: IFailed;
}

export const getJob = (params: IGetJobRequestParams): Promise<IGetJobResult> =>
    request.call(
        (routes.jobs.getJob as TRouteHandler)(params)
    ).then(({ data: { data: { status, data: { failed } } } }: AxiosResponse<IGetJobResponse>) => ({
        status,
        failed
    }));

export default getJob;
