import { IDocument } from './models/Document';
import { IDocumentsFilter } from './services/GetDocuments';
import { IVersion } from './models/Version';
import { IVersionDetails } from './models/VersionDetails';

export interface IDocumentsSearchState {
    serviceId?: string;
    id?: number;
    docType?: 'patchnote' | 'juristic';
    showDeletedVersions?: boolean;
}

export interface IDocuments {
    selectedDocument: IDocument;
    selectedService?: string;
    selectedVersion: IVersion | IVersionDetails;
    searchResult: { [key: string]: Array<IDocument> };
    searchState: IDocumentsSearchState;
}

export const documents: IDocuments = {
    selectedDocument: null,
    selectedService: null,
    selectedVersion: null,
    searchResult: {},
    searchState: {}
};
