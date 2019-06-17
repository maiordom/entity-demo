import qs from 'qs';

import { IGetTransactionsParams } from 'src/entities/Billing/services/GetTransactions';

export default {
    getAccountBalance: ({ userId }) => ({
        url: `/api/billing/users/${userId}/accounts/`,
        method: 'GET'
    }),
    setTestMoney: {
        url: '/api/billing/payments/tests/',
        method: 'POST'
    },
    setTestAccount: {
        method: 'PUT',
        url: '/api/billing/accounts/tests/'
    },
    getTransactions: (params: IGetTransactionsParams) => ({
        url: `/api/billing/transactions/?${qs.stringify(params)}`,
        method: 'GET'
    }),
    transferPayment: {
        method: 'POST',
        url: '/api/billing/payments/transfered/'
    },
    cancelBonus: {
        url: '/api/billing/bonuses/cancelled/',
        method: 'POST'
    },
    cancelPayment: {
        url: '/api/billing/payments/cancelled/',
        method: 'POST'
    }
};
