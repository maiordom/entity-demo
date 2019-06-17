import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

export interface IAddUsersToGroupRequestParams {
    groupId: number;
    userIds: Array<string>;
}

export const addUsersToGroup = (params: IAddUsersToGroupRequestParams) =>
    request.call(
        routes.groupManager.addUsersToGroup,
        params
    );

export default addUsersToGroup;
