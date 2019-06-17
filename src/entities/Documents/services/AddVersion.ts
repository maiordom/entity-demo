import { AxiosResponse } from 'axios';
import moment from 'moment';
import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IVersion } from '../models/Version';
import { IVersionDetails } from '../models/VersionDetails';

export interface IAddVersionServiceRequestParams {
    value: IVersion | IVersionDetails;
}

export interface IAddVersionResponse {
    data: IVersion | IVersionDetails;
}

export interface IAddVersionResult {
    version: IVersion | IVersionDetails;
}

export const addVersion = (params: IAddVersionServiceRequestParams): Promise<IAddVersionResult> =>
    request.call(routes.documents.addVersion, params).then(({ data: { data } }: AxiosResponse<IAddVersionResponse>) => ({
        version: {
            documentId: data.documentId,
            id: data.id,
            isPublished: !data.isDeleted && data.isPublished,
            isDeleted: data.isDeleted,
            name: data.name,
            version: data.version,
            whenCreated: moment(data.whenCreated).format('DD/M/YYYY, h:mm'),
            whenModified: moment(data.whenModified).format('DD/M/YYYY, h:mm')
        }
    })
);

export default addVersion;
