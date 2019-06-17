import * as moment from 'moment';

import addDocumentService from 'src/entities/Documents/services/AddDocument';
import addVersionService from 'src/entities/Documents/services/AddVersion';
import getDocumentsService from 'src/entities/Documents/services/GetDocuments';
import PublishVersionService from 'src/entities/Documents/services/PublishVersion';
import { ILocale } from '../../Documents/models/Version';

export type ISaveShopItemDescriptionRequestParams = {
    serviceId: string;
    id: number;
    name: ILocale;
    body: ILocale;
    versionName: string;
};

export const saveShopItemDescription = async ({ serviceId, id, name, body, versionName}: ISaveShopItemDescriptionRequestParams) => {
    let { documents: [ document ] } = await getDocumentsService({ serviceId, filter: {}, tag: String(id) });

    if (!document) {
        document = (await addDocumentService({
            value: {
                name: 'some',
                type: 'webshopDescription',
                tag: String(id),
                serviceId
            }
        })).document;

        if (!document) { return Promise.reject('Не удалось создать документ') }
    };
        

    return addVersionService({
        value: {
            name,
            body,
            version: versionName,
            serviceId,
            documentId: document.id,
            type: document.type,
            date: moment().toISOString()
        }
    }).then(({ version }) => PublishVersionService({ versionId: version.id }));
}

export default saveShopItemDescription;
