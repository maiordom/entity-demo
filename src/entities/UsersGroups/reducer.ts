import { handleActions } from 'redux-actions';
import find from 'lodash/find';
import reject from 'lodash/reject';

import { IAction } from 'src/types/IAction';
import { IStore } from 'src/store';
import * as a from './actions';

export default handleActions({
    [a.setUsersGroups.name]: (state: IStore, { payload: { groups, serviceId } }: IAction<a.ISetUsersGroupsParams>) => {
        state.usersGroups[serviceId] = groups;
        return state;
    },

    [a.setUsersGroup.name]: (state: IStore, { payload: { group, serviceId } }: IAction<a.ISetUsersGroupParams>) => {
        if (!state.usersGroups[serviceId]) {
            state.usersGroups[serviceId] = [];
        }

        const usersGroup = find(state.usersGroups[serviceId], { id: group.id });

        if (usersGroup) {
            Object.assign(usersGroup, group);
        } else {
            state.usersGroups[serviceId].push(group);
        }

        state.usersGroups[serviceId] = [...state.usersGroups[serviceId]];
        return state;
    },

    [a.deleteUsersGroup.name]: (state: IStore, { payload: { serviceId, group } }: IAction<a.IDeleteUsersGroupParams>) => {
        state.usersGroups[serviceId] = reject(state.usersGroups[serviceId], { id: group.id });

        return state;
    }
}, {});
