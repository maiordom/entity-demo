import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface IBanGameAccountRequestParams {
    login: string;
    reason: IReason;
    date: string;
    toPartnerId: string;
}

export const banGameAccount = (params: IBanGameAccountRequestParams) =>
    request.call(routes.gameAuth.banGameAccount, params);

export default banGameAccount;
