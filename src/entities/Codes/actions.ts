import { createAction } from 'src/utils/CreateAction';
import { IAction } from 'src/types/IAction';

import { createCodes as createCodesService, ICreateCodeParams } from './services/CreateCodes';
import { download } from 'src/utils/Download';

export { ICreateCodeParams } from  './services/CreateCodes';

import getEmissionsService, { IGetEmissionsRequestParams, IEmission } from './services/GetEmissions';
export { IGetEmissionsRequestParams } from './services/GetEmissions';

import getCodesByEmissionIdService, {IGetCodesByEmissionIdRequestParams } from './services/GetCodesByEmissionId';
export { IGetCodesByEmissionIdRequestParams } from './services/GetCodesByEmissionId';

export interface ISetEmissionsParams { total: number; from: number; serviceId: string; emissions: Array<IEmission>; }
export interface ISetEmissionsAction extends IAction<ISetEmissionsParams> {}

export const {
    setEmissions
} = {
    setEmissions: (params: ISetEmissionsParams) => createAction('setEmissions', params)
};

export const createCodes = (params: ICreateCodeParams) => () => {
    return createCodesService(params).then(res => {
        download(
            `${params.promoCode.serviceId}-promocodes-${res.emissionId}.txt`,
            JSON.stringify(res, null, 2),
            'text/plain'
        );
    });
};

export const getEmissions = (params: IGetEmissionsRequestParams) => (dispatch) =>
    getEmissionsService(params).then(res => {
        dispatch(setEmissions({
            from: params.from,
            serviceId: params.serviceId,
            total: res.total,
            emissions: res.items
        }));
    });

export const getCodesByEmissionId = (params: IGetCodesByEmissionIdRequestParams) => () =>
    getCodesByEmissionIdService(params).then(res => {
        download(
            `promocodes-${params.emissionId}.txt`,
            JSON.stringify(res, null, 2),
            'text/plain'
        );
    });
