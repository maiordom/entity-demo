export interface IUserClaims {
    [key: string]: IUserClaimsByType;
}

export type IUserClaimsByType = Array<string>;
