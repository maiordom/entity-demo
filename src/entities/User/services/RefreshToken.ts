import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IToken } from '../store';

export interface IRefreshTokenRequestParams {
    refresh_token: string;
}

interface IRefreshTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export const refreshToken = (requestParams: IRefreshTokenRequestParams) =>
    request.call(routes.admin.connectToken, {
        ...requestParams,
        grant_type: 'refresh_token'
    }, true).then(({ data }: AxiosResponse<IRefreshTokenResponse>) => ({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type
    } as IToken));

export default refreshToken;
