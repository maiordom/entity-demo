import { handleActions } from 'redux-actions';

import { IAction } from 'src/types/IAction';
import * as a from './actions';
import { IStore } from 'src/store';

const parseJWT = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
};

export default handleActions({
    [a.setToken.name]: (state: IStore, action: IAction<a.ISetTokenParams>) => {
        state.user.token = action.payload;

        return state;
    },

    [a.setProfile.name]: (state: IStore, action: IAction<a.ISetProfileParams>) => {
        state.user.profile = action.payload;

        return state;
    },

    [a.setPermissions.name]: (state: IStore, action: IAction<a.ISetPermissionsParams>) => {
        state.user.permissions = action.payload;

        return state;
    },

    [a.setUserClaims.name]: (state: IStore, action: IAction<a.ISetUserClaimsParams>) => {
        state.user.claims = action.payload;

        return state;
    }
}, {});
