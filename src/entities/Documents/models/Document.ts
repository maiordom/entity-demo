import { IVersion } from './Version';

export interface IDocumentWithoutVersions {
    banner?: string;
    id: number;
    name: { ru?: 'string', eu?: 'string', br?: 'string' };
    tag?: string;
    type: 'patchnote' | 'juristic' | 'webshopAfterPurchase' | 'webshopDescription';
    serviceId: string;
    whenCreated?: Date;
}

export interface IDocument extends IDocumentWithoutVersions {
    versions?: Array<IVersion>;
}
