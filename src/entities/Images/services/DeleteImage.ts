import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';

export interface IDeleteImageRequestParams {
    imageGroup: string;
    imageId?: string;
};

export const deleteImage = ({ imageGroup, imageId }: IDeleteImageRequestParams) =>
    request.call((routes.images.deleteImage as TRouteHandler)({ imageGroup, imageId }));

export default deleteImage;