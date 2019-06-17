import qs from 'qs';

import { IGetDocumentsRequestParams } from 'src/entities/Documents/services/GetDocuments';
import { IGetDocumentByIdRequestParams } from 'src/entities/Documents/services/GetDocumentById';
import { IGetVersionsRequestParams } from 'src/entities/Documents/services/GetVersions';
import { IGetVersionDetailsRequestParams } from 'src/entities/Documents/services/GetVersionDetails';
import { IPublishVersionRequestParams } from 'src/entities/Documents/services/PublishVersion';
import { IUnpublishVersionRequestParams } from 'src/entities/Documents/services/UnpublishVersion';
import { IDeleteDocumentRequestParams } from 'src/entities/Documents/services/DeleteDocument';
import { IDeleteVersionRequestParams } from 'src/entities/Documents/services/DeleteVersion';

export default {
    getDocuments: ({ filter, serviceId, tag }: IGetDocumentsRequestParams) => ({
        method: 'GET',
        url: `/api/documents/documents?${qs.stringify({ serviceId, tag, ...filter }, { indices: false })}`
    }),
    addDocument: {
        method: 'POST',
        url: '/api/documents/documents'
    },
    addVersion: {
        method: 'POST',
        url: '/api/documents/documents/versions/'
    },
    saveDocument: {
        method: 'PUT',
        url: '/api/documents/documents'
    },
    saveVersion: {
        method: 'PUT',
        url: '/api/documents/documents/versions/'
    },
    deleteDocument: (params: IDeleteDocumentRequestParams) => ({
        method: 'DELETE',
        url: `/api/documents/documents/${params.id}/`
    }),
    deleteVersion: (params: IDeleteVersionRequestParams) => ({
        method: 'DELETE',
        url: `/api/documents/documents/versions/${params.versionId}/`
    }),
    getDocumentById: (params: IGetDocumentByIdRequestParams) => ({
        method: 'GET',
        url: `/api/documents/documents/${params.id}`
    }),
    getShopItemDescription: ({ serviceId, id }: { serviceId: string, id: number }) => ({
        method: 'GET',
        url: `/api/documents/documents/versions/services/${serviceId}/documents/webshopDescription/versions/last?tags=${id}`
    }),
    getVersions: ({ documentId, serviceId, filter }: IGetVersionsRequestParams) => ({
        method: 'GET',
        url: `/api/documents/documents/versions?${qs.stringify({ documentId, serviceId, ...filter }, { indices: false })}`
    }),
    getVersionById: ({ documentId, serviceId, filter }: IGetVersionsRequestParams) => ({
        method: 'GET',
        url: `/api/documents/documents/versions?${qs.stringify({ documentId, serviceId, ...filter }, { indices: false })}`
    }),
    getVersionDetails: ({ versionId }: IGetVersionDetailsRequestParams) => ({
        method: 'GET',
        url: `/api/documents/documents/versions/${versionId}`
    }),
    publishVersion: ({ versionId }: IPublishVersionRequestParams) => ({
        method: 'PUT',
        url: `/api/documents/documents/versions/${versionId}/published/`
    }),
    unpublishVersion: ({ versionId }: IUnpublishVersionRequestParams) => ({
        method: 'DELETE',
        url: `/api/documents/documents/versions/${versionId}/published/`
    })
};
