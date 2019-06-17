import qs from 'qs';
import { IGetEmissionsRequestParams } from 'src/entities/Codes/services/GetEmissions';

export default {
    createCodes: {
        method: 'POST',
        url: '/api/webshop/admin/promocodes/'
    },
    getEmissions: (params: IGetEmissionsRequestParams) => ({
        method: 'GET',
        url: `/api/webshop/admin/emissions/promocodes/?${qs.stringify(params)}`
    }),
    getCodesByEmissionId: ({ emissionId }: { emissionId: number; }) => ({
        url: `/api/webshop/admin/promocodes/emissions/${emissionId}/`,
        method: 'GET'
    })
};
