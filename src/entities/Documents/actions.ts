import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';
import uuid from 'uuid/v4';
import { IDocument } from './models/Document';
import { IVersion } from './models/Version';
import { IDocumentsSearchState } from './store';

import getDocumentsService, {
    IGetDocumentsRequestParams,
    IGetDocumentsResult
} from './services/GetDocuments';

import getVersionsService, {
    IGetVersionsRequestParams,
    IGetVersionsResult
} from './services/GetVersions';

import getVersionDetailsService, {
    IGetVersionDetailsRequestParams,
    IGetVersionDetailsResult
} from './services/GetVersionDetails';

import getDocumentByIdService, {
    IGetDocumentByIdRequestParams,
    IGetDocumentByIdResult
} from './services/GetDocumentById';

import addDocumentService, {
    IAddDocumentRequestParams,
    IAddDocumentResult
} from './services/AddDocument';

import saveDocumentService, {
    ISaveDocumentRequestParams,
} from './services/SaveDocument';

import saveVersionService, {
    ISaveVersionRequestParams
} from './services/SaveVersion';

import unpublishVersionService, {
    IUnpublishVersionRequestParams
} from './services/UnpublishVersion';

import publishVersionService, {
    IPublishVersionRequestParams,
} from './services/PublishVersion';

import addVersionService, {
    IAddVersionServiceRequestParams
} from './services/AddVersion';

import deleteDocumentService, {
    IDeleteDocumentRequestParams
} from './services/DeleteDocument';

import deleteVersionService, {
    IDeleteVersionRequestParams
} from './services/DeleteVersion';

import UploadImageService, {
    IUploadImageRequestParams
} from '../Images/services/UploadImage';

import DeleteImageService, {
    IDeleteImageRequestParams
} from '../Images/services/DeleteImage';

import { IVersionDetails } from './models/VersionDetails';
import { IStore } from 'src/store';
import { IImage } from 'src/entities/Documents/models/VersionImage';

export { IAddDocumentRequestParams };
export { ISaveDocumentRequestParams };
export { ISaveVersionRequestParams };
export { IGetDocumentsRequestParams, IGetDocumentsResult };
export { IGetDocumentByIdRequestParams, IGetDocumentByIdResult };
export { IGetVersionsRequestParams, IGetVersionsResult };
export { IGetVersionDetailsRequestParams, IGetVersionDetailsResult };
export { IDeleteDocumentRequestParams };

export interface ISetDocumentsParams { documents: Array<IDocument>; serviceId: string; }
export interface ISetDocumentsAction extends IAction<ISetDocumentsParams> {}

export interface ISetDocumentParams { document: IDocument; serviceId: string; }
export interface ISetDocumentAction extends IAction<ISetDocumentParams> {}

export interface IUpdateDocumentParams { document: IDocument; serviceId: string; }
export interface IUpdateDocumentAction extends IAction<IUpdateDocumentParams> {}

export interface IUpdateVersionParams { data: any; versionId: number; updateSelected?: boolean  }
export interface IUpdateVersionAction extends IAction<IUpdateVersionParams> {}

export interface ISetDocumentsSearchParams extends IDocumentsSearchState {}
export interface ISetDocumentsSearchAction extends IAction<ISetDocumentsSearchParams> {}

export interface ISetVersionsParams { documentId: number; versions: Array<IVersion>; serviceId: string; }
export interface ISetVersionsAction extends IAction<ISetVersionsParams> {}

export interface ISetVersionParams { version: IVersion | IVersionDetails; serviceId: string; }
export interface ISetVersionAction extends IAction<ISetVersionParams> {}

export interface ISetVersionDetailsParams { versionId: number; documentId: number; }
export interface ISetVersionDetailsAction extends IAction<ISetVersionDetailsParams> {}

export interface IPublishVersionParams { version: IVersion | IVersionDetails; documentId: number; }
export interface IPublishVersionAction extends IAction<IPublishVersionParams> {}

export interface IUnpublishVersionParams { version: IVersion | IVersionDetails; documentId: number; }
export interface IUnpublishVersionAction extends IAction<IUnpublishVersionParams> {}

export interface IAddVersionRequestParams extends IAddVersionServiceRequestParams { value: IVersion; serviceId: string; }
export interface IAddVersionAction extends IAction<IAddVersionRequestParams> {}

export interface IRemoveDocumentParams { documentId: number; serviceId: string; }
export interface IRemoveDocumentAction extends IAction<IRemoveDocumentParams> {}

export interface IDeleteVersionParams { documentId: number; versionId: number }
export interface IRemoveVersionParams { documentId: number; versionId: number }
export interface IRemoveVersionAction extends IAction<IRemoveVersionParams> {}

export interface IOpenDocumentParams { document: IDocument; }
export interface IOpenDocumentAction extends IAction<IOpenDocumentParams> {}

export interface ISavePatchnoteImagesParams { files: { [key: string]: IImage } }
export interface ISavePatchnoteBannerParams { file: File, id?: number }

export interface IDeletePatchnoteBannerParams { id: number }

export interface ISetActiveDocumentParams { id: number; serviceId: string; }
export interface ISetActiveDocumentAction extends IAction<ISetActiveDocumentParams> {}

export interface ISetActiveServiceParams { serviceId: string; }
export interface ISetActiveServiceAction extends IAction<ISetActiveServiceParams> {}

export interface ISetActiveVersionParams { version: IVersion | IVersionDetails; }
export interface ISetActiveVersionAction extends IAction<ISetActiveVersionParams> {}

export interface ISetAccountsExtraInfoParams { extraInfo: { id?: number; login?: string; }; accounts: Array<IDocument>; }
export interface ISetAccountsExtraInfoAction extends IAction<ISetAccountsExtraInfoParams> {}

export const {
    clearDocuments,
    removeDocument,
    setActiveDocument,
    setActiveService,
    setActiveVersion,
    setDocument,
    setDocuments,
    setDocumentsSearch,
    setVersion,
    setVersions,
    updateDocument,
    updateVersion,
} = {
    clearDocuments: () => createAction('clearDocuments'),
    setDocument: (params: ISetDocumentParams) => createAction('setDocument', params),
    setDocuments: (params: ISetDocumentsParams) => createAction('setDocuments', params),
    removeDocument: (params: IRemoveDocumentParams) => createAction('removeDocument', params),
    setActiveDocument: (params: ISetActiveDocumentParams) => createAction('setActiveDocument', params),
    setActiveService: (params: ISetActiveServiceParams) => createAction('setActiveService', params),
    setActiveVersion: (params: ISetActiveVersionParams) => createAction('setActiveVersion', params),
    setDocumentsSearch: (params: ISetDocumentsSearchParams) => createAction('setDocumentsSearch', params),
    setVersion: (params: ISetVersionParams) => createAction('setVersion', params),
    setVersions: (params: ISetVersionsParams) => createAction('setVersions', params),
    updateDocument: (params: IUpdateDocumentParams) => createAction('updateDocument', params),
    updateVersion: (params: IUpdateVersionParams) => createAction('updateVersion', params)
};

export const addDocument = (params: IAddDocumentRequestParams) => async (dispatch) => {
    const { document } = await addDocumentService(params);

    dispatch(setDocument({ document, serviceId: document.serviceId }));
};

export const addVersion = (params: IAddVersionRequestParams) => async (dispatch) => {
    const { version } = await addVersionService(params);

    dispatch(setVersion({ version, serviceId: params.serviceId }));

    return version;
}

export const deleteDocument = (params: IDeleteDocumentRequestParams) => async (dispatch) => {
    await deleteDocumentService(params);
    
    dispatch(removeDocument({ documentId: params.id, serviceId: params.serviceId }));
}

export const deleteVersion = ({ documentId, versionId }: IRemoveVersionParams) => async (dispatch) => {
    await deleteVersionService({ versionId });
    
    dispatch(updateVersion({
        data: { isPublished: false, isDeleted: true },
        versionId,
        updateSelected: true
    }));
}

export const getDocuments = (params: IGetDocumentsRequestParams) => async (dispatch) => {
    const { documents, from, total } =  await getDocumentsService(params);

    dispatch(setDocuments({ documents, serviceId: params.serviceId }));
}

export const getDocumentById = (params: IGetDocumentByIdRequestParams) => async (dispatch) => {
    const { documents } = await getDocumentByIdService(params);
    const [ document ] = documents;

    dispatch(setDocuments({ documents, serviceId: document && document.serviceId  }));
}

export const getVersions = (params: IGetVersionsRequestParams) => async (dispatch) => {
    const { versions, from, total } = await getVersionsService(params);

    dispatch(setVersions({ documentId: params.documentId, versions, serviceId: params.serviceId }));
}

export const getVersionDetails = ({ documentId, versionId }: IGetVersionDetailsRequestParams) => async (dispatch) => {
    const { version } = await getVersionDetailsService({ documentId, versionId });

    dispatch(setActiveVersion({ version }));

    return version;
}

export const publishVersion = ({ documentId, version }: IPublishVersionParams) => (dispatch): Promise<void> =>
    publishVersionService({ versionId: version.id }).then(() => {
        dispatch(updateVersion({
            data: { isPublished: true },
            versionId: version.id,
            updateSelected: true
        }));
    });

export const saveDocument = (params: ISaveDocumentRequestParams) => (dispatch, getState: () => IStore): Promise<void> => {
    return saveDocumentService(params).then(() => {
        const document = params.value;

        dispatch(updateDocument({ document, serviceId: document.serviceId }));
    });
}

export const saveVersion = (params: ISaveVersionRequestParams) => (dispatch, getState: () => IStore): Promise<any> => saveVersionService(params).then((version) => {
    if (params.value && params.value.body) {
        delete params.value.body;
    }

    dispatch(updateVersion({
        data: { ...params.value },
        versionId: params.value.id,
        updateSelected: true
    }));
});

export const unpublishVersion = ({ documentId, version }: IUnpublishVersionParams) => (dispatch): Promise<void> =>
    unpublishVersionService({ versionId: version.id }).then(() => {
        dispatch(updateVersion({
            data: { isPublished: false },
            versionId: version.id,
            updateSelected: true
        }));
    });

export const savePatchnoteImages = ({ files }: ISavePatchnoteImagesParams) => (dispatch): Promise<IImage[]> => {
    const promises = []

    for (let key in files) {
        const id = uuid();
        const file = files[key] && files[key].data;

        if (file) {
            promises.push(UploadImageService({ file, imageGroup: 'patchnoteimages', imageId: id }).then(({ data: { data } }) => ({
                name: file.name,
                src: data.url,
            })).catch(() => ({
                isError: true
            })))
        }
    }

    return Promise.all(promises)
}

export const savePatchnoteBanner = ({ file, id }: ISavePatchnoteBannerParams) => (dispatch): void => {
    UploadImageService({ file, imageGroup: 'patchnotebanners', imageId: String(id) }).catch(() => ({
        isError: true
    }));
}

export const deletePatchnoteBanner = ({ id }) => (dispatch): void => {
    DeleteImageService({ imageGroup: 'patchnotebanners', imageId: id }).catch(() => ({
        isError: true
    }));
}
