import { IValue } from 'src/types/IValue';

export interface IShopItem {
    id: number;
    serviceId?: string;
    name?: IValue;
    slug?: string;
    price?: number;
    description?: {
        [key: string]: {
            text: string;
            type: string;
        };
    };
    versions?: Array<IShopItem>;
}