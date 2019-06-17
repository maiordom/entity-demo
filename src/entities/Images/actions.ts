import uuidv4 from 'uuid/v4';

import uploadImageService, {
    IUploadImageRequestParams
} from './services/UploadImage';

import deleteImageService, {
    IDeleteImageRequestParams
} from './services/DeleteImage';

export { IUploadImageRequestParams } from './services/UploadImage';
export { IDeleteImageRequestParams } from './services/DeleteImage';

export interface IUploadImageResponse {
    imageId: string;
}

export const uploadImage = (params: IUploadImageRequestParams) => () => {
    const imageId: string = uuidv4();

    params.imageId = imageId;

    return uploadImageService(params).then(() => ({ imageId }));
};

export const deleteImage = (params: IDeleteImageRequestParams) => () => {
    return deleteImageService(params);
};
