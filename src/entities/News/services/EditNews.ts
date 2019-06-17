import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { INews } from '../models/News';

export interface IEditNewsRequestParams {
    value: INews;
}

export const editNews = (params: IEditNewsRequestParams) =>
    request.call(routes.news.editNews, params);

export default editNews;
