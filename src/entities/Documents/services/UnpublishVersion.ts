import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IUnpublishVersionRequestParams {
    versionId: number;
}

export const unpublishVersion = (params: IUnpublishVersionRequestParams) =>
    request.call((routes.documents.unpublishVersion  as TRouteHandler)(params));

export default unpublishVersion;
