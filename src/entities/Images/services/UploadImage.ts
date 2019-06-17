import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export type IUploadImageRequestParams = {
    imageGroup: string;
    imageId?: string;
    file: File;
};

export const uploadImage = ({ imageGroup, imageId, file }: IUploadImageRequestParams) => {
    const data = new FormData();

    data.set('data', file);

    return request.call(
        (routes.images.uploadImage as TRouteHandler)({ imageGroup, imageId }),
        data
    );
};

export default uploadImage;