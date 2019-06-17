import { createAction } from 'src/utils/CreateAction';

export interface ISetPropertyParams { paramName: string; paramValue: string; }

export const {
    setProperty
} = {
    setProperty: (params) => createAction('setProperty', params)
};
