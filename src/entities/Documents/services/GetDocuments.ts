import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IDocument, IDocumentWithoutVersions } from '../models/Document';
import { IPagination } from 'src/types/IPagination'

export interface IDocumentsFilter {
    from?: number;
    count?: number;
    docType?: 'patchnote' | 'juristic' | 'webshopAfterPurchase';
}

export interface IGetDocumentsRequestParams {
    serviceId: string;
    filter: IDocumentsFilter;
    tag?: string;
}

interface IGetDocumentsResponse {
    data: IPagination<IDocument>;
}

export interface IGetDocumentsResult {
    from: number,
    total: number,
    documents: Array<IDocument>;
}

export const getDocuments = (params: IGetDocumentsRequestParams): Promise<IGetDocumentsResult> =>
    request.call(
        (routes.documents.getDocuments as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetDocumentsResponse>) => ({
        from: data.from,
        total: data.total,
        documents: data.items.map((item: IDocumentWithoutVersions) => <IDocument> {
            id: item.id,
            name: item.name,
            serviceId: item.serviceId,
            tag: item.tag,
            type: item.type,
            whenCreated: item.whenCreated
        })
    })).catch(() => ({
        from: 0,
        total: 0,
        documents: []
    }));

export default getDocuments;
