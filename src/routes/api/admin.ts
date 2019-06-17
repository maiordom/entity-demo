import { authErrorResolver } from './index';

export default {
    connectToken: {
        method: 'POST',
        url: '/connect/token',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        errorResolver: authErrorResolver
    },
    getProfile: {
        method: 'GET',
        url: '/api/auth/profile'
    },
    getApps: {
        method: 'GET',
        url: '/api/services'
    },
    getProduct: ({ userId, productId }: { userId: string; productId: number; }) => ({
        url: `/api/webshop/admin/products/${productId}/impersonalized/${userId}`,
        method: 'GET'
    })
};
