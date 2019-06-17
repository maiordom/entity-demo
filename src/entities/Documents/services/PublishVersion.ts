import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IPublishVersionRequestParams {
    versionId: number;
}

export const publishVersion = (params: IPublishVersionRequestParams) =>
    request.call((routes.documents.publishVersion as TRouteHandler)(params))

export default publishVersion;
