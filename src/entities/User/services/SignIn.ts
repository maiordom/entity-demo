import { AxiosResponse } from 'axios';

import { request } from 'src/utils/Request';
import routes from 'src/routes/api';

import { IToken } from '../store';

export interface ISignInRequestParams {
    username: string;
    password: string;
}

interface ISignInResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export const signIn = (requestParams: ISignInRequestParams) =>
    request.call(routes.admin.connectToken, {
        ...requestParams,
        grant_type: 'password'
    }, true).then((res: AxiosResponse<ISignInResponse>) => {
        const { data } = res;

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenType: data.token_type
        } as IToken;
    });

export default signIn;