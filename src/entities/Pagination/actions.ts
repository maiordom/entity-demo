import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { IOption } from 'src/entities/Pagination/store';

export interface ISetPaginationParams { option: IOption; }
export interface ISetPaginationAction extends IAction<ISetPaginationParams> {}

export const {
    setPagination
} = {
    setPagination: (params: ISetPaginationParams) => createAction('setPagination', params)
};
