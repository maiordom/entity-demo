import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IReason } from 'src/types/IReason';

export interface IUnbanGameAccountRequestParams {
    login: string;
    reason: IReason;
    toPartnerId: string;
}

export const unbanGameAccount = (params: IUnbanGameAccountRequestParams) =>
    request.call(routes.gameAuth.unbanGameAccount, params);

export default unbanGameAccount;
