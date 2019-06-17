import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { ICreatePage } from './models/Page';

export interface ICreateContentPageRequestParams {
    page: ICreatePage;
}

interface ICreatePageResponse {
    data: {
        id: number;
    };
}

export const createContentPage = (params: ICreateContentPageRequestParams) =>
    request.call(routes.content.createContentPage, params).then((
        { data: { data }}: AxiosResponse<ICreatePageResponse>
    ) => ({
        id: data.id
    }));

export default createContentPage;
