import createNewsService, { ICreateNewsRequestParams } from './services/CreateNews';
export { ICreateNewsRequestParams, ICreateNewsResult } from './services/CreateNews';

import editNewsService, { IEditNewsRequestParams } from './services/EditNews';
export { IEditNewsRequestParams } from './services/EditNews';

import deleteNewsService, { IDeleteNewsRequestParams } from './services/DeleteNews';
export { IDeleteNewsRequestParams } from './services/DeleteNews';

import getNewsService, { IGetNewsRequestParams } from './services/GetNews';
export { IGetNewsRequestParams } from './services/GetNews';

export const createNews = (params: ICreateNewsRequestParams) => () =>
    createNewsService(params);

export const editNews = (params: IEditNewsRequestParams) => () =>
    editNewsService(params);

export const deleteNews = (params: IDeleteNewsRequestParams) => () =>
    deleteNewsService(params);

export const getNews = (params: IGetNewsRequestParams) => () =>
    getNewsService(params);
