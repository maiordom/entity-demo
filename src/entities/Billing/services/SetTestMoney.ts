import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

export interface ISetTestMoneyParams {
    userId: string;
    amount: number;
}

export const setTestMoney = (params: ISetTestMoneyParams) =>
    request.call(routes.billing.setTestMoney, params);

export default setTestMoney;
