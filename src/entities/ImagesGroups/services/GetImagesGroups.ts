import { AxiosResponse } from 'axios';
import camelCase from 'lodash/camelCase';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IImagesGroups } from '../store';

interface IGetImagesGroupsResponse {
    data: Array<{
        type: string;
        templateUrl: string;
        sizes: Array<{
            width: number;
            height: number;
            alias: string;
        }>;
    }>;
}

export const getImagesGroups = () =>
    request.call(routes.media.getGroups).then((
        { data: { data } }: AxiosResponse<IGetImagesGroupsResponse>
    ): IImagesGroups =>
        data.reduce((tree, { templateUrl, type, sizes }) => {
            tree[type] = sizes.reduce((obj, { alias, width, height }) => {
                obj[camelCase(alias || 'default')] = templateUrl
                    .replace('{width}', String(width))
                    .replace('{height}', String(height));

                return obj;
            }, {});

            return tree;
        }, {}));

export default getImagesGroups;
