import { IGetClaimsRequestParams } from 'src/entities/Claim/services/GetClaims';
import { IGetAllClaimsRequestParams } from 'src/entities/Claim/services/GetAllClaims';
import { IAddClaimRequestParams } from 'src/entities/Claim/services/AddClaim';
import { IDeleteClaimRequestParams } from 'src/entities/Claim/services/DeleteClaim';

export default {
    getClaims: ({ userId }: IGetClaimsRequestParams) => ({
        url: `/api/auth/admin/users/${userId}/claims/`,
        method: 'GET'
    }),
    getAllClaims: ({ userId }: IGetAllClaimsRequestParams) => ({
        url: `/api/auth/admin/users/${userId}/claims/all`,
        method: 'GET'
    }),
    addClaim: ({ userId, claim, value }: IAddClaimRequestParams) => ({
        url: `/api/auth/admin/users/${userId}/claims/${claim}/values/${value}/`,
        method: 'POST'
    }),
    deleteClaim: ({ userId, claim, value }: IDeleteClaimRequestParams) => ({
        url: `/api/auth/admin/users/${userId}/claims/${claim}/values/${value}/`,
        method: 'DELETE'
    })
};
