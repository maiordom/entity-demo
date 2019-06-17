import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IWidgetSingle } from './models/Widget';

export interface ICreateWidgetRequestParams<T> {
    widget: T;
}

interface ICreateWidgetResponse {
    data: {
        id: number;
        url: string;
    };
}

export const createWidget = (params: ICreateWidgetRequestParams<IWidgetSingle>) =>
    request.call(routes.content.createWidget, params).then((
        { data: { data }}: AxiosResponse<ICreateWidgetResponse>
    ) => ({
        id: data.id,
        url: data.url,
    }));

export default createWidget;
