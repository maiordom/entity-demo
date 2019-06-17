import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { IVersionDetails } from '../models/VersionDetails';

export interface IGetVersionDetailsRequestParams {
   versionId: number;
   documentId: number;
}

interface IGetVersionDetailsResponse {
    data: IVersionDetails;
}

export interface IGetVersionDetailsResult {
    version: IVersionDetails;
}


export const getVersionDetails = (params: IGetVersionDetailsRequestParams): Promise<IGetVersionDetailsResult> =>
    request.call(
        (routes.documents.getVersionDetails as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetVersionDetailsResponse>) => ({
        version: {
            banner: data.banner,
            body: data.body,
            id: data.id,
            name: data.name,
            type: data.type,
            documentId: data.documentId,
            serviceId: data.serviceId,
            version: data.version,
            isPublished: !data.isDeleted && data.isPublished,
            date: moment(data.date).toISOString(),
            whenCreated: moment(data.whenCreated).format('DD/M/YYYY, h:mm'),
            whenModified: moment(data.whenModified).format('DD/M/YYYY, h:mm'),
            isDeleted: data.isDeleted,
            whenPublished: moment(data.whenPublished).format('DD/M/YYYY, h:mm'),
            whenDeleted: moment(data.whenDeleted).format('DD/M/YYYY, h:mm'),
            deletedBy: data.deletedBy,
            publishedBy: data.publishedBy
        }
    }));

export default getVersionDetails;
