import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IVersion } from '../models/Version';
import { IPagination } from 'src/types/IPagination'

export interface IVersionsFilter {
    from?: number;
    count?: number;
    isPublished?: boolean;
}

export interface IGetVersionsRequestParams {
    serviceId?: string;
    documentId: number;
    filter?: IVersionsFilter
}

interface IGetVersionsResponse {
    data: IPagination<IVersion>;
}

export interface IGetVersionsResult {
    from: number,
    total: number,
    versions: Array<IVersion>;
}

export const getVersions = (params: IGetVersionsRequestParams): Promise<IGetVersionsResult> =>
    request.call(
        (routes.documents.getVersions as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetVersionsResponse>) => ({
        from: data.from,
        total: data.total,
        versions: data.items.map((item: any) => <IVersion> {
            documentId: item.documentId,
            id: item.id,
            isPublished: Boolean(item.isPublished),
            isDeleted: item.isDeleted || false,
            name: item.name,
            version: item.version,
            whenCreated: moment(item.whenCreated).format('DD/M/YYYY, h:mm'),
            whenModified: moment(item.whenModified).format('DD/M/YYYY, h:mm')
        })
    })).catch(() => ({
        from: 0,
        total: 0,
        versions: []
    }));

export default getVersions;
