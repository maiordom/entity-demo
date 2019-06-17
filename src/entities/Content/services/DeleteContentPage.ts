import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export type IDeleteContentPageRequestParams = {
    pageId: number;
};

export const deleteContentPage = (params: IDeleteContentPageRequestParams) =>
    request.call((routes.content.deleteContentPage as TRouteHandler)(params));

export default deleteContentPage;
