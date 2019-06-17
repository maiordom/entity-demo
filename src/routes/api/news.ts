export default {
    createNews: {
        url: '/api/news/admin/feeds/items/',
        method: 'POST'
    },
    editNews: {
        url: '/api/news/admin/feeds/items/',
        method: 'PUT'
    },
    deleteNews: ({ id }: { id: string }) => ({
        url: `/api/news/admin/feeds/items/${id}/`,
        method: 'DELETE'
    }),
    getNews: ({ feedId }: { feedId: string; }) => ({
        url: `/api/news/admin/feeds/${feedId}/items/`,
        method: 'GET'
    })
};
