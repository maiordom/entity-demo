import qs from 'qs';

import { IGetPromoCodeByCodeRequestParams } from 'src/entities/PromoCodes/services/GetPromoCodeByCode';
import { IGetPromoCodeActivationsRequestParams } from 'src/entities/PromoCodes/services/GetPromoCodeActivations';

export default {
    getPromoCodeByCode: ({ promoCode }: IGetPromoCodeByCodeRequestParams) => ({
        url: `/api/webshop/admin/promocodes/codes/${promoCode}`,
        method: 'GET'
    }),
    getPromoCodeActivations: ({ promoCodeId, from, count }: IGetPromoCodeActivationsRequestParams) => ({
        url: `/api/webshop/admin/promocodes/activations?${qs.stringify({ promoCodeId, from, count })}`,
        method: 'GET'
    })
};
