export interface IUsersGroup {
    id?: number;
    name: string;
    whenModified?: string;
    description: string;
    size?: number;
    users?: Array<string>;
    serviceId: string;
}

export type IUsersGroups = Array<IUsersGroup>;

export interface IUsersGroupsModel {
    [key: string]: IUsersGroups
}
