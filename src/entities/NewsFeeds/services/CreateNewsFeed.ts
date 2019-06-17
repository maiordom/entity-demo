import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IFeed } from '../models/Feed';

export interface ICreateNewsFeedResponse {
    data: ICreateNewsFeedResult;
}

export interface ICreateNewsFeedResult {
    id: string;
}

export interface ICreateNewsFeedRequestParams {
    value: IFeed;
}

export const createNewsFeed = (params: ICreateNewsFeedRequestParams): Promise<ICreateNewsFeedResult> =>
    request.call(
        routes.newsFeeds.createNewsFeed, params
    ).then(({ data: { data: { id } }}: AxiosResponse<ICreateNewsFeedResponse>) => ({
        id
    }));

export default createNewsFeed;
