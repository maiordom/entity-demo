import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { INews } from '../models/News';

export interface ICreateNewsRequestParams {
    value: INews;
}

export interface ICreateNewsResponse {
    data: INews;
}

export interface ICreateNewsResult {
    id: string;
}

export const createNews = (params: ICreateNewsRequestParams): Promise<ICreateNewsResult> =>
    request.call(
        routes.news.createNews, params
    ).then(({ data: { data: { id } } }: AxiosResponse<ICreateNewsResponse>) => ({
        id
    }));

export default createNews;
