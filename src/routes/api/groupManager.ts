import { IDeleteUsersGroupRequestParams } from 'src/entities/UsersGroups/services/DeleteUsersGroup';

export default {
    getUsersGroups: {
        method: 'GET',
        url: '/api/groupmanager/groups'
    },
    addUsersGroup: {
        method: 'POST',
        url: '/api/groupmanager/groups'
    },
    editUsersGroup: {
        method: 'PUT',
        url: '/api/groupmanager/groups'
    },
    getUsersList: ({ groupId }: { groupId: number; }) => ({
        method: 'GET',
        url: `/api/groupmanager/groups/${groupId}/users`
    }),
    addUsersToGroup: {
        method: 'POST',
        url: '/api/groupmanager/groups/users'
    },
    deleteUsersGroup: ({ id }: IDeleteUsersGroupRequestParams) => ({
        method: 'DELETE',
        url: `/api/groupmanager/groups/${id}`
    })
};
