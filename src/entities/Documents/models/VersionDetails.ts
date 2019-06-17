import { IVersion, ILocale } from './Version';

export interface IVersionDetails extends IVersion {
    banner?: string;
    body?: ILocale;
    bannerImage?: string;
    documentImages?: { [key: string]: string };
    bannerType?: 'text' | 'image';
}
