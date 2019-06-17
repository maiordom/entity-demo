import { request } from 'src/utils/Request';
import routes from 'src/routes/api';
import { IDocument, IDocumentWithoutVersions } from '../models/Document';

export interface ISaveDocumentRequestParams {
    value: IDocument
}

interface IGetDocumentByIdResponse {
    data: IDocumentWithoutVersions;
}

export interface ISaveDocumentResult {
    document: IDocument;
}

export const saveDocument = (params: ISaveDocumentRequestParams): Promise<any> =>
    request.call(routes.documents.saveDocument, params);

export default saveDocument;
