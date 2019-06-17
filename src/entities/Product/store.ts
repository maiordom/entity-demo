import { IValue } from 'src/types/IValue';

export interface IProduct {
    id: number;
    price?: number;
    referencePrice?: number;
    serviceId?: string;
    name?: IValue;
    slug: string;
    previewImageUrl?: string;
    description?: {
        [key: string]: {
            type: string;
            text: string;
        };
    };
}
