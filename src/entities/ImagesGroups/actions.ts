import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import getGroupsImagesService from './services/GetImagesGroups';

import { IImagesGroups } from './store';

export interface ISetImagesGroupsParams { groups: IImagesGroups; }
export interface ISetImagesGroupsAction extends IAction<ISetImagesGroupsParams> {}

export const {
    setImagesGroups
} = {
    setImagesGroups: (params: ISetImagesGroupsParams) => createAction('setImagesGroups', params)
};

export const getImagesGroups = () => (dispatch) =>
    getGroupsImagesService().then(res => {
        dispatch(setImagesGroups({ groups: res }));
    });