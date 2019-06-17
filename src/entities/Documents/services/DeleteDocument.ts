import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteDocumentRequestParams {
    id: number;
    serviceId: string;
}

export const deleteDocument = (params: IDeleteDocumentRequestParams): Promise<any> =>
    request.call((routes.documents.deleteDocument as TRouteHandler)(params))

export default deleteDocument;
