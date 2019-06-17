import {
    getUsersList as getUsersListService,
    IGetUsersListRequestParams
} from './services/GetUsersList';

export {
    IGetUsersListRequestParams,
    IUsersList
} from './services/GetUsersList';

export const getUsersList = (params: IGetUsersListRequestParams) => () =>
    getUsersListService(params);
