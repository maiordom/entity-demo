export interface IPage extends IPageBase {
    whenModified?: string;
};

export interface IPageBase {
    id?: number;
    slug: string;
    region: string;
    application: string;
    serviceId: string;
    name: string;
    isDefault: boolean;
}

export interface ICreatePage extends IPageBase {
    widgets: Array<number>;
}

export interface IUpdatePage extends IPageBase {
    widgets: Array<number>;
}
