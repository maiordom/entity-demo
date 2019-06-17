import qs from 'qs';

import { IGetAccountsRequestParams } from 'src/entities/Accounts/services/GetAccounts';
import { IGetAccountsByIdsRequestParams } from 'src/entities/Accounts/services/GetAccountsByIds';
import { IRemoveAccountRequestParams } from 'src/entities/Accounts/services/RemoveAccount';

export default {
    getAccounts: ({ contact }: IGetAccountsRequestParams) => ({
        method: 'GET',
        url: `/api/auth/admin/users/${contact}`
    }),
    getAccountsByIds: ({ userIds }: IGetAccountsByIdsRequestParams) => ({
        method: 'GET',
        url: `/api/auth/admin/users/?${qs.stringify({ userId: userIds }, { indices: false })}`
    }),
    removeAccount: ({ userId }: IRemoveAccountRequestParams) => ({
        method: 'POST',
        url: `/api/auth/admin/users/${userId}/erased/`
    })
};
