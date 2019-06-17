import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IApps, IApp } from '../store';

const dictionary: any = require('src/dictionary.json');

export interface IGetAppsResponse {
    data: Array<IAppResponse>;
}

interface IAppResponse {
    id: string;
}

export const getApps = () =>
    request.call(routes.admin.getApps).then((res: AxiosResponse<IGetAppsResponse>) => {
        const { data } = res.data;

        return data.reduce((result: IApps, item: IAppResponse) => {
            const dictionaryItem = dictionary.apps[item.id];
            const appName = dictionaryItem && dictionaryItem.name || item.id;
            const region = dictionaryItem && dictionaryItem.region && dictionaryItem.region.toUpperCase() || '';

            result[item.id] = {
                id: item.id,
                name: `${appName} ${region}`
            } as IApp;

            return result;
        }, {}) as IApps;
    });

export default getApps;