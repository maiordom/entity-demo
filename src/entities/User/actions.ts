import { createAction } from 'src/utils/CreateAction';

import { signIn as signInService, ISignInRequestParams } from './services/SignIn';
import { refreshToken as refreshTokenService, IRefreshTokenRequestParams } from './services/RefreshToken';
import { getProfile as getProfileService } from './services/GetProfile';
import { getAllClaims } from 'src/entities/Claim/actions';

export { ISignInRequestParams } from './services/SignIn';

import { IToken, IPermissions, IProfile } from './store';
import { IStore } from 'src/store';
import { IUserClaims } from 'src/entities/User/store';

export interface ISetTokenParams extends IToken {}
export interface ISetPermissionsParams extends IPermissions {}
export interface ISetUserClaimsParams extends IUserClaims {}
export interface ISetProfileParams extends IProfile {}

export const {
    setToken,
    setPermissions,
    setUserClaims,
    setProfile
} = {
    setToken: (params: ISetTokenParams) => createAction('setToken', params),
    setPermissions: (params: ISetPermissionsParams) => createAction('setPermissions', params),
    setUserClaims: (params: ISetUserClaimsParams) => createAction('setUserClaims', params),
    setProfile: (params: ISetProfileParams) => createAction('setProfile', params)
};

export const signIn = (params: ISignInRequestParams) => async (dispatch) => {
    const token = await signInService(params);

    dispatch(setToken(token));
};

export const refreshToken = (params: IRefreshTokenRequestParams) => async (dispatch) => {
    const token = await refreshTokenService(params);

    dispatch(setToken(token));
};

export const getProfile = () => async (dispatch, getState: () => IStore) => {
    const profile = await getProfileService();
    const { groups } = getState().claims;
    const claims = await dispatch(getAllClaims({ userId: profile.userId }));
    const permissions = claims.reduce((permissions, item) => {
        const service = permissions[item.type];

        permissions[item.type] = service
            ? [ ...permissions[item.type], item.value ]
            : [ item.value ];

        return permissions;
    }, []);
    const mapTypeToAlias = Object.keys(groups).reduce((result, item) => {
        groups[item].claims.forEach((claim) => {
            if (claim.alias) {
                result[claim.source] = claim.alias;
            }
        });

        return result;
    }, {});
    const userClaims = claims.reduce((claims, item) => {
        const type = mapTypeToAlias[item.type] ? mapTypeToAlias[item.type] : item.type.trim();

        claims[`${type}.${item.value}`] = true;

        return claims;
    }, {});

    dispatch(setPermissions(permissions))
    dispatch(setUserClaims(userClaims));
    dispatch(setProfile(profile));
};

export const logout = () => () => {
    localStorage.clear();
};
