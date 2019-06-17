import getProductService, { IGetProductRequestParams } from './services/GetProduct';

import { IStore } from 'src/store';

export { IProduct } from './store';

export const getProduct = (params: IGetProductRequestParams) => (dispatch, getState: () => IStore) => {
    const productTemplateUrl = getState().imagesGroups.products.launcherProduct;

    return getProductService(params).then(res => {
        res.previewImageUrl = productTemplateUrl.replace('{id}', String(params.productId));
        return res;
    });
}
