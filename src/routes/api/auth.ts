import { IResetEmailUrlParams } from 'src/entities/Auth/services/ResetEmail';
import { IDeletePhoneUrlParams } from 'src/entities/Auth/services/DeletePhone';
import { IChangeProfileUrlParams } from 'src/entities/Auth/services/ChangeProfile';
import { IBanAccountRequestParams } from 'src/entities/Auth/services/BanAccount';
import { IUnbanAccountRequestParams } from 'src/entities/Auth/services/UnbanAccount';

export default {
    banAccount: ({ userId }: IBanAccountRequestParams) => ({
        url: `/api/auth/admin/users/${userId}/ban`,
        method: 'PUT'
    }),
    unbanAccount: ({ userId }: IUnbanAccountRequestParams) => ({
        url: `/api/auth/admin/users/${userId}/ban`,
        method: 'DELETE'
    }),
    resetEmail: ({ userId }: IResetEmailUrlParams) => ({
        url: `/api/auth/admin/users/${userId}/emails/`,
        method: 'POST'
    }),
    deletePhone: ({ userId }: IDeletePhoneUrlParams) => ({
        url: `/api/auth/admin/users/${userId}/phones/`,
        method: 'DELETE'
    }),
    changeProfile: ({ userId }: IChangeProfileUrlParams) => ({
        url: `/api/auth/admin/users/${userId}/profiles/`,
        method: 'PUT'
    }),
    getRegistrationContext: ({ userId }) => ({
        url: `/api/auth/admin/users/${userId}/registrationcontext`,
        method: 'GET'
    })
}
