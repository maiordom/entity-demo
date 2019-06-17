import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteVersionRequestParams {
    versionId: number;
}

export const deleteVersion = (params: IDeleteVersionRequestParams): Promise<any> =>
    request.call((routes.documents.deleteVersion as TRouteHandler)(params))

export default deleteVersion;
