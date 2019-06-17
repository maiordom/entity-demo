import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IUpdatePage } from './models/Page';

export interface IUpdateContentPageRequestParams {
    page: IUpdatePage;
}

export const updateContentPage = (params: IUpdateContentPageRequestParams) =>
    request.call(routes.content.updateContentPage, params);

export default updateContentPage;
