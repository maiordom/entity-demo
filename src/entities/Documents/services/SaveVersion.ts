import { request } from 'src/utils/Request';
import routes from 'src/routes/api';
import { IVersion } from '../models/Version';
import { IVersionDetails } from '../models/VersionDetails';

export interface ISaveVersionRequestParams {
    value: IVersion | IVersionDetails;
}

export const saveVersion = (params: ISaveVersionRequestParams) =>
    request.call(routes.documents.saveVersion, params)

export default saveVersion;
