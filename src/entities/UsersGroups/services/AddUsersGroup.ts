import { AxiosResponse } from 'axios';
import format from 'date-fns/format';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IUsersGroup } from '../store';
export { IUsersGroup } from '../store';

export interface IAddUsersGroupRequestParams {
    users: Array<string>;
    name: string;
    description: string;
    serviceId: string;
}

interface IAddUsersGroupResponse {
    data: {
        id: number;
        name: string;
        when_modified: string;
        description: string;
        users: Array<string>;
        serviceId: string;
    }
}

export type IAddUsersGroupResult = IUsersGroup;

export const addUsersGroup = (params: IAddUsersGroupRequestParams) =>
    request.call(
        routes.groupManager.addUsersGroup,
        { value: params }
    ).then(({ data: { data } }: AxiosResponse<IAddUsersGroupResponse>) => ({
        id: data.id,
        name: data.name,
        description: data.description,
        size: data.users.length,
        whenModified: format(data.when_modified, 'YYYY-MM-DD HH:mm'),
        serviceId: data.serviceId
    } as IUsersGroup));

export default addUsersGroup;
