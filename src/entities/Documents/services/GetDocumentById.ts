import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { IDocument, IDocumentWithoutVersions } from '../models/Document';

export interface IGetDocumentByIdRequestParams {
    id: number
}

interface IGetDocumentByIdResponse {
    data: IDocumentWithoutVersions;
}

export interface IGetDocumentByIdResult {
    documents: Array<IDocument>;
}

export const getDocumentById = (params: IGetDocumentByIdRequestParams): Promise<IGetDocumentByIdResult> =>
    request.call(
        (routes.documents.getDocumentById as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetDocumentByIdResponse>) => ({
        documents: [{
            id: data.id,
            name: data.name,
            version: data,
            serviceId: data.serviceId,
            tag: data.tag,
            type: data.type,
            whenCreated: data.whenCreated
        }]
    })).catch(() => ({
        from: 0,
        total: 0,
        documents: []
    }));

export default getDocumentById;