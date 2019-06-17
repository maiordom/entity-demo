import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { IDocument, IDocumentWithoutVersions } from '../models/Document';

export interface IAddDocumentRequestParams {
    value: {
        name: any;
        type: string;
        tag?: string;
        serviceId: string;
    }
}

interface IAddDocumentResponse {
    data: IDocumentWithoutVersions;
}

export interface IAddDocumentResult {
    document: IDocumentWithoutVersions
}

export const addDocument = (params: IAddDocumentRequestParams): Promise<IAddDocumentResult> =>
    request.call(routes.documents.addDocument, params).then(({ data: { data }}: AxiosResponse<IAddDocumentResponse>) => ({
        document: {
            id: data.id,
            name: data.name,
            serviceId: data.serviceId,
            tag: data.tag,
            type: data.type,
            whenCreated: data.whenCreated
        }
    })
);

export default addDocument;