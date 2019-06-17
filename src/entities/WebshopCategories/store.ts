import { IWebshopCategory as IWebshopCategoryRaw } from 'src/entities/WebshopCategories/models/WebshopCategory';

export interface IWebshopCategory extends IWebshopCategoryRaw {
    childrens: Array<IWebshopCategory>;
}

export interface IWebshopCategories {
    [serviceId: string]: {
        tree: { [categoryId: string]: IWebshopCategory; };
        map: { [categoryId: string]: IWebshopCategory; };
        raw: Array<IWebshopCategoryRaw>;
    };
}

export const webshopCategories: IWebshopCategories = {
};
