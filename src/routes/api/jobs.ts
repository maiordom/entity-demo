import qs from 'qs';

import { IGetJobRequestParams } from 'src/entities/Jobs/services/GetJob';

export default {
    getJob: ({ id, ...params }: IGetJobRequestParams) => ({
        url: `/api/pgw/game/auth/private/jobs/${id}/?${qs.stringify(params)}`,
        method: 'GET'
    })
};
