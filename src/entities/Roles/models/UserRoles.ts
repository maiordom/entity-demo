export interface IUserRoles {
    [key: string]: IUserRolesByType;
}

export type IUserRolesByType = Array<string>;
