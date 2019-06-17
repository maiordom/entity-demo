import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteNewsRequestParams {
    id: string;
}

export const deleteNews = (params: IDeleteNewsRequestParams) =>
    request.call(
        (routes.news.deleteNews as TRouteHandler)(params)
    );

export default deleteNews;
