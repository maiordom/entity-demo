import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteUsersGroupRequestParams {
    id: number;
}

export const deleteUsersGroup = (params: IDeleteUsersGroupRequestParams) =>
    request.call(
        (routes.groupManager.deleteUsersGroup as TRouteHandler)(params)
    );

export default deleteUsersGroup;
