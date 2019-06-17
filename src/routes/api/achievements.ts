import qs from 'qs';

export default {
    getAchievementsByIds: ({ userId, ids, toPartnerId }) => ({
        url: `/api/pgw/achievements/public/users/${userId}/achievements/ids/?toPartnerId=${toPartnerId}&${qs.stringify({ id: ids }, { indices: false })}`,
        method: 'GET'
    }),
    getAchievementsByService: (params) => ({
        url: `/api/pgw/achievements/admin/achievements/?${qs.stringify(params)}`,
        method: 'GET'
    })
};
