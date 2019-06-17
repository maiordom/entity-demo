import { AxiosResponse } from 'axios';
import format from 'date-fns/format';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IGetCodesByEmissionIdRequestParams {
    emissionId: number;
}

export interface IGetCodesByEmissionIdResponse {
    data: Array<{
        code: string;
    }>;
}

const getCodesByEmissionId = (params: IGetCodesByEmissionIdRequestParams) =>
    request.call(
        (routes.codes.getCodesByEmissionId as TRouteHandler)(params as any)
    ).then((
        { data: { data } }: AxiosResponse<IGetCodesByEmissionIdResponse>
    ) => ({
        codes: data.map(item => item.code)
    }));

export default getCodesByEmissionId;
