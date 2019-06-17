export interface ISubscriptionType {
    type: 'subscription';
    days: number;
}

export interface IRoleType {
    type: 'role';
    roleId: number;
}

export interface IWithExternalDataType {
    type: 'withExternalData';
    data: string;
}

export type IDataType = ISubscriptionType | IRoleType | IWithExternalDataType;

export interface IGameShopItem {
    id?: string;
    name: {
        ru: string;
        en: string;
        pt: string;
    };
    data?: IDataType;
    stackSize?: string;
    categoryId?: string;
}
