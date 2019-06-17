export interface IWebshopCategory {
    id?: number;
    name: {
        ru: string;
        en: string;
        pt: string;
    },
    slug: string;
    isHidden: boolean;
    serviceId: string;
    parentCategoryId?: number;
}