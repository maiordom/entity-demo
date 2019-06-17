import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

export interface ISetTestAccountParams {
    userId: number;
}

export const setTestAccount = (params: ISetTestAccountParams): Promise<any> =>
    request.call(routes.billing.setTestAccount, params);

export default setTestAccount;
