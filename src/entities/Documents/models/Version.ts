import { IValue } from 'src/types/IValue';

export type ILocale = IValue;

export interface IVersion {
    id?: number;
    name: ILocale;
    banner?: string;
    body?: ILocale;
    version: string;
    serviceId?: string;
    documentId?: number;
    isPublished?: boolean;
    date?: string;
    type?: '' | 'patchnote' | 'juristic' | 'webshopAfterPurchase' | 'webshopDescription';
    whenCreated?: string;
    whenModified?: string;
    isDeleted?: boolean;
    whenPublished?: string;
    whenDeleted?: string;
    deletedBy?: number;
    publishedBy?: number;
}
