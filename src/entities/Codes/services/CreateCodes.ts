import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { ICodeComponents } from '../models/Component';
export { ICodeComponents } from '../models/Component';

import { ICodeRestrictions } from '../models/Restriction';
export { ICodeRestrictions, TRestriction, TRestrictionType } from '../models/Restriction';
import { IValue } from 'src/types/IValue';

export interface ICreateCodeParams {
    batch: number;
    name: string;
    description?: IValue;
    promoCode: {
        activateOnlyOnce: boolean;
        serviceId: string;
        components: ICodeComponents;
        restrictions: ICodeRestrictions;
        code?: string;
    };
}

interface ICreateCodesResponse {
    data: {
        codes: Array<string>;
        emissionId: number;
    };
}

export const createCodes = (params: ICreateCodeParams) =>
    request.call(routes.codes.createCodes, params).then((
        { data: { data }}: AxiosResponse<ICreateCodesResponse>
    ) => ({
        params,
        codes: data.codes,
        emissionId: data.emissionId
    }));

export default createCodes;
