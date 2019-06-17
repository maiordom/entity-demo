import { AxiosResponse } from 'axios';
import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export type IGetUsersListRequestParams = {
    groupId: number;
};

interface IGetUsersListResponse {
    data: Array<{
        userId: number;
    }>;
}

export type IUsersList = Array<number>;

export const getUsersList = (params: IGetUsersListRequestParams) =>
    request.call(
        (routes.groupManager.getUsersList as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetUsersListResponse>) =>
        data.map(user => user.userId)
    );

export default getUsersList;
