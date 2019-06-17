import { handleActions } from 'redux-actions';
import find from 'lodash/find';

import { IStore } from 'src/store';

import {
    ISetDocumentAction,
    ISetDocumentsAction,
    ISetDocumentsSearchAction,
    ISetVersionAction,
    ISetVersionsAction,
    ISetActiveDocumentAction,
    ISetActiveServiceAction,
    ISetActiveVersionAction,
    ISetVersionDetailsAction,
    ISetAccountsExtraInfoAction,
    IOpenDocumentAction,
    IUpdateDocumentAction,
    IUpdateVersionAction,
    IRemoveDocumentAction,
    IRemoveVersionAction
} from './actions';

import * as a from './actions';

export default handleActions({
    [a.clearDocuments.name]: (state: IStore) => {
        const { searchResult } = state.documents;

        state.documents = { ...state.documents };

        state.documents.searchResult = {};
        state.documents.selectedDocument = null;
        state.documents.selectedVersion = null;

        return state;
    },

    [a.removeDocument.name]: (state: IStore, { payload: { documentId, serviceId } }: IRemoveDocumentAction) => {
        const { searchResult } = state.documents;
        const currentDocuments = searchResult[serviceId].filter(({ id }) => documentId !== id);

        state.documents = { ...state.documents };
        state.documents.searchResult[serviceId] = [ ...currentDocuments ];
        state.documents.selectedDocument = null;
        state.documents.selectedVersion = null;

        return state;
    },

    [a.setActiveDocument.name]: (state: IStore, { payload: { id, serviceId } }: ISetActiveDocumentAction) => {
        const { searchResult } = state.documents;
        const currentDocument = find(searchResult[serviceId], { id });

        state.documents = { ...state.documents };
        state.documents.selectedDocument = currentDocument;

        return state;
    },

    [a.setActiveService.name]: (state: IStore, { payload: { serviceId } }: ISetActiveServiceAction) => {
        state.documents = { ...state.documents };
        state.documents.selectedService = serviceId;

        return state;
    },

    [a.setActiveVersion.name]: (state: IStore, { payload: { version } }: ISetActiveVersionAction) => {
        const { selectedDocument } = state.documents;

        state.documents = { ...state.documents };
        state.documents.selectedVersion = version;

        return state;
    },

    [a.setDocument.name]: (state: IStore, { payload: { document, serviceId } }: ISetDocumentAction) => {
        const { searchResult } = state.documents;

        searchResult[serviceId] = [ document, ...searchResult[serviceId] ];
        state.documents = { ...state.documents };
        state.documents.searchResult = { ...searchResult };

        return state;
    },

    [a.setDocuments.name]: (state: IStore, { payload: { documents, serviceId } }: ISetDocumentsAction) => {
        const { searchResult } = state.documents;
        const existedDocuments = searchResult[serviceId] ? searchResult[serviceId] : [];

        searchResult[serviceId] = [ ...existedDocuments, ...documents ];
        state.documents = { ...state.documents };
        state.documents.searchResult = { ...searchResult }

        return state;
    },

    [a.setDocumentsSearch.name]: (state: IStore, { payload }: ISetDocumentsSearchAction) => {
        const { searchState } = state.documents;

        state.documents.searchState = { ...searchState, ...payload };

        return state;
    },

    [a.setVersion.name]: (state: IStore, { payload: { version, serviceId } }: ISetVersionAction) => {
        const { searchResult, selectedDocument } = state.documents;
        const currentDocuments = searchResult[serviceId];
        const currentDocument = find(searchResult[serviceId], { id: version.documentId });
        const newVersion = { ...version };

        delete newVersion.body;

        if (selectedDocument && selectedDocument.id === version.documentId) {
            selectedDocument.versions = [ version, ...selectedDocument.versions ];
        }

        state.documents = { ...state.documents };
        state.documents.searchResult = { ...searchResult };

        return state;
    },

    [a.setVersions.name]: (state: IStore, { payload: { documentId, versions, serviceId } }: ISetVersionsAction) => {
        const { searchResult, selectedDocument } = state.documents;

        const currentDocument = find(searchResult[serviceId], { id: documentId });

        currentDocument.versions = versions;

        if (selectedDocument && selectedDocument.id === documentId) {
            state.documents.selectedDocument.versions = versions;
        }

        state.documents = { ...state.documents };
        state.documents.searchResult = { ...searchResult };

        return state;
    },

    [a.updateDocument.name]: (state: IStore, { payload: { document, serviceId } }: IUpdateDocumentAction) => {
        const { searchResult } = state.documents;
        const currentDocuments = searchResult[serviceId].map((existingDocument) => {
            if (existingDocument.id === document.id) {
                return document;
            }

            return existingDocument;
        })


        state.documents = { ...state.documents };
        state.documents.searchResult = { ...searchResult };

        return state;
    },

    [a.updateVersion.name]: (state: IStore, { payload: { data, versionId, updateSelected } }: IUpdateVersionAction) => {
        const { searchResult, selectedDocument, selectedVersion } = state.documents;
        const { serviceId } = selectedDocument;
        const currentDocuments = state.documents.searchResult[serviceId];
        const currentDocument = find(currentDocuments, { id: selectedDocument.id });

        currentDocument.versions = currentDocument.versions.map((version) => {
            if (versionId === version.id) {
                return { ...version, ...data }
            }

            return version
        });

        state.documents = { ...state.documents };
        state.documents.searchResult[serviceId] = [...searchResult[serviceId] ];

        if (updateSelected) {
            state.documents.selectedVersion = { ...selectedVersion, ...data };
        }
    
        return state;
    },
}, {});
