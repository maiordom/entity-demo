import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

export interface IEditUsersGroupRequestParams {
    id: number;
    name: string;
    description: string;
    users: Array<string>;
    serviceId: string;
}

export const editUsersGroup = (params: IEditUsersGroupRequestParams) =>
    request.call(
        routes.groupManager.editUsersGroup,
        { value: params }
    );

export default editUsersGroup;
