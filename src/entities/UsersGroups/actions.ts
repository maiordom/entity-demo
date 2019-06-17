import { createAction } from 'src/utils/CreateAction';

import { IUsersGroups, IUsersGroup } from './store';

export interface ISetUsersGroupsParams { serviceId: string; groups: IUsersGroups; }
export interface ISetUsersGroupParams { serviceId: string; group: IUsersGroup; }
export interface IDeleteUsersGroupParams { serviceId: string; group: IUsersGroup; }

export const {
    setUsersGroups,
    setUsersGroup,
    deleteUsersGroup
} = {
    setUsersGroups: (params: ISetUsersGroupsParams) => createAction('setUsersGroups', params),
    setUsersGroup: (params: ISetUsersGroupParams) => createAction('setUsersGroup', params),
    deleteUsersGroup: (params: IDeleteUsersGroupParams) => createAction('deleteUsersGroup', params)
};
