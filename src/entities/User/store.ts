export interface IToken {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface IProfile {
    userId: string;
    username: string;
    email: string;
}

export type IPermission = Array<string>;

export interface IPermissions {
    [key: string]: IPermission;
}

export interface IUserClaims {
    [claim: string]: boolean;
}

export interface IUser {
    token?: IToken;
    profile?: IProfile;
    permissions: IPermissions;
    claims: IUserClaims;
}
