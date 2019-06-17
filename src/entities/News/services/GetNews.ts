import { AxiosResponse } from 'axios';
import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import moment from 'moment';

import { INews } from '../models/News';

export interface IGetNewsRequestParams {
    feedId: string;
}

export interface IGetNewsResponse {
    data: Array<INews>;
}

export const getNews = (params: IGetNewsRequestParams) =>
    request.call(
        (routes.news.getNews as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetNewsResponse>) => ({
        news: data.map(news => ({
            feedId: news.feedId,
            id: news.id,
            imageId: news.imageId,
            title: news.title,
            lead: news.lead,
            whenPublished: moment(news.whenPublished).format('YYYY.MM.DD HH:mm'),
            sourceData: {
                source: news.sourceData.source,
                url: news.sourceData.url
            }
        })).sort((a, b) => {
            if ((new Date(a.whenPublished)).getTime() > (new Date(b.whenPublished)).getTime()) { return -1; }
            if ((new Date(a.whenPublished)).getTime() < (new Date(b.whenPublished)).getTime()) { return 1; }
            return 0;
        })
    }));

export default getNews;
