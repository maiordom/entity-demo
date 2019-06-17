import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IAreaItem } from './store';

import { request, webshopTransport } from 'src/utils/Request';

export interface ISetAreaParams { area: IAreaItem; }
export interface ISetAreaAction extends IAction<ISetAreaParams> {}

export const {
    setArea
} = {
    setArea: (params: ISetAreaParams) => createAction('setArea', params)
};

export const setAreaAction = (params: ISetAreaParams) => (dispatch) => {
    request.init('admin', params.area.id);
    webshopTransport.init('webshop', params.area.id);

    dispatch(setArea(params));

    location.reload();
};