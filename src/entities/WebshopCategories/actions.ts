import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IWebshopCategory } from './models/WebshopCategory';

import getWebshopCategoriesService, { IGetWebshopCategoriesRequestParams } from './services/GetWebshopCategories';
export { IGetWebshopCategoriesRequestParams } from './services/GetWebshopCategories';

import editWebshopCategoryService, { IEditWebshopCategoryRequestParams } from './services/EditWebshopCategory';
export { IEditWebshopCategoryRequestParams } from './services/EditWebshopCategory';

import createWebshopCategoryService, { ICreateWebshopCategoryRequestParams } from './services/CreateWebshopCategory';
export { ICreateWebshopCategoryRequestParams } from './services/CreateWebshopCategory';

import deleteWebshopCategoryService, { IDeleteWebshopCategoryRequestParams } from './services/DeleteWebshopCategory';
export { IDeleteWebshopCategoryRequestParams } from './services/DeleteWebshopCategory';

export interface ISetWebshopCategoriesParams { serviceId: string; categories: Array<IWebshopCategory>; }
export interface ISetWebshopCategoriesAction extends IAction<ISetWebshopCategoriesParams> {}

export interface IChangeWebshopCategoryParams { category: IWebshopCategory; parentCategoryId: number; }
export interface IChangeWebshopCategoryAction extends IAction<IChangeWebshopCategoryParams> {}

export const {
    setWebshopCategories,
    changeWebshopCategory
} = {
    setWebshopCategories: (params: ISetWebshopCategoriesParams) => createAction('setWebshopCategories', params),
    changeWebshopCategory: (params: IChangeWebshopCategoryParams) => createAction('changeWebshopCategory', params)
};

export const editWebshopCategory = (params: IEditWebshopCategoryRequestParams) => () =>
    editWebshopCategoryService(params);

export const createWebshopCategory = (params: ICreateWebshopCategoryRequestParams) => () =>
    createWebshopCategoryService(params);

export const deleteWebshopCategory = (params: IDeleteWebshopCategoryRequestParams) => () =>
    deleteWebshopCategoryService(params);

export const getWebshopCategories = (params: IGetWebshopCategoriesRequestParams) => async (dispatch) => {
    const { categories } = await getWebshopCategoriesService(params);

    dispatch(setWebshopCategories({
        serviceId: params.serviceId,
        categories
    }));
};
