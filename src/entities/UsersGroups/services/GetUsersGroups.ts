import { AxiosResponse } from 'axios';
import format from 'date-fns/format';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';
import { IUsersGroup } from '../store';

export { IUsersGroup, IUsersGroups } from '../store';

export interface IGetUsersGroupsRequestParams {
    serviceId: string;
}

interface IUsersGroupResponse {
    id: number;
    name: string;
    when_modified: string;
    description: string;
    size: number;
    serviceId: string;
}

interface IGetUsersGroupsResponse {
    data: Array<IUsersGroupResponse>;
}

export type IGetUsersGroupsResult = Array<IUsersGroup>;

export const getUsersGroups = (params: IGetUsersGroupsRequestParams) =>
    request.call(
        routes.groupManager.getUsersGroups,
        params
    ).then((res: AxiosResponse<IGetUsersGroupsResponse>) => {
        const { data } = res.data;

        return data.map((item: IUsersGroupResponse) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            whenModified: format(item.when_modified, 'YYYY-MM-DD HH:mm'),
            size: item.size,
            serviceId: item.serviceId
        } as IUsersGroup));
    }
);

export default getUsersGroups;
