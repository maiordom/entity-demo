import qs from 'qs';

export default {
    createContentPage: {
        method: 'POST',
        url: '/api/content/admin/pages'
    },
    createWidget: {
        method: 'POST',
        url: '/api/content/admin/widgets'
    },
    createCollection: {
        method: 'POST',
        url: '/api/content/admin/widgets/collection'
    },
    getContentPage: ({ pageId }: { pageId: number }) => ({
        method: 'GET',
        url: `/api/content/admin/pages/${pageId}`
    }),
    updateContentPage: {
        method: 'PUT',
        url: '/api/content/admin/pages'
    },
    getContentPages: (params: { serviceId?: string; }) => ({
        method: 'GET',
        url: `/api/content/admin/pages?${qs.stringify(params)}`
    }),
    deleteContentPage: ({ pageId }: { pageId: number; }) => ({
        method: 'DELETE',
        url: `api/content/admin/pages/${pageId}`
    })
};
