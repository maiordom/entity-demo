import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IWidgetCollectionRequestType } from './models/Widget';

export interface ICreateCollectionRequestParams {
    widget: IWidgetCollectionRequestType;
}

interface ICreateCollectionResponse {
    data: {
        id: number;
    };
}

export const createCollection = (params: ICreateCollectionRequestParams) =>
    request.call(routes.content.createCollection, params).then((
        { data: { data }}: AxiosResponse<ICreateCollectionResponse>
    ) => ({
        id: data.id
    }));

export default createCollection;
