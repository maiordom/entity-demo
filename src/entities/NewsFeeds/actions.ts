import createNewsFeedService, { ICreateNewsFeedRequestParams } from './services/CreateNewsFeed';
export { ICreateNewsFeedRequestParams, ICreateNewsFeedResult } from './services/CreateNewsFeed';

export const createNewsFeed = (params: ICreateNewsFeedRequestParams) => () =>
    createNewsFeedService(params);
