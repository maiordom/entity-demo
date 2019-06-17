export interface IApps {
    [key: string]: IApp
}

export interface IApp {
    id: string;
    name?: string;
}

export type IAppsOptions = {
    items: Array<IOption>;
    selected: IOption;
}

export interface IOption {
    id: number | string;
    value: number | string;
}

export const appsOptions: IAppsOptions = {
    items: [],
    selected: {
        id: null,
        value: null
    }
};