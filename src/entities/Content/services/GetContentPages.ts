import { AxiosResponse } from 'axios';
import format from 'date-fns/format';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

import { IContentPage } from '../store';
import { IPage } from './models/Page';

export type IGetContentPagesRequestParams = {
    serviceId: string;
};

interface IGetContentPagesResponse {
    data: Array<IPage>;
}

export const getContentPages = (params: IGetContentPagesRequestParams) =>
    request.call(
        (routes.content.getContentPages as TRouteHandler)(params)
    ).then(({ data }: AxiosResponse<IGetContentPagesResponse>) => data.data.map(page => ({
        id: page.id,
        region: page.region,
        slug: page.slug,
        application: page.application,
        serviceId: page.serviceId,
        name: page.name,
        isDefault: page.isDefault,
        whenModified: format(page.whenModified, 'YYYY-MM-DD HH:mm'),
        widgets: []
    } as IContentPage)));

export default getContentPages;
