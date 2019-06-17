export default {
    deleteImage: ({ imageGroup, imageId }: { imageGroup: string; imageId: string; }) => ({
        method: 'DELETE',
        url: `/api/media/admin/images/${imageGroup}/${imageId}`
    }),
    uploadImage: ({ imageGroup, imageId }: { imageGroup: string; imageId: string; }) => ({
        method: 'POST',
        url: `/api/media/admin/images/${imageGroup}/${imageId}`
    })
};
