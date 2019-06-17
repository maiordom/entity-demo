import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import uuidv4 from 'uuid/v4';
import * as qs from 'qs';
import * as NanoEvents from 'nanoevents';

import Config from 'src/config';
import { IStore, IError } from 'src/store';

const config = Config();

let store;

export const setStore = (storeLink) => {
    store = storeLink;
};

const emitter = new NanoEvents();

export interface IAxiosRequestConfig extends AxiosRequestConfig {
    routeName?: string;
    urlParams?: {
        [key: string]: string | number;
    };
    errorResolver?: (res: AxiosError) => IError;
}

export const on = (event, callback) => emitter.on(event, callback);

type TType = 'admin' | 'webshop';
type TArea = 'ru' | 'eu' | 'br';

class Request {
    axiosInstance: AxiosInstance;

    init(type: TType, area: TArea) {
        this.axiosInstance = axios.create({
            baseURL: config[area][type],
            timeout: 10000
        });

        this.axiosInstance.interceptors.request.use((requestConfig: IAxiosRequestConfig) => {
            requestConfig.headers['X-Request-Id'] = uuidv4();
            
            const state: IStore = store.getState();
            const token = state.user.token;
        
            if (token) {
                requestConfig.headers.authorization = `${token.tokenType} ${token.accessToken}`;
            }
        
            return requestConfig;
        }, Promise.reject);
    }

    log(
        config: AxiosRequestConfig,
        requestConfig: IAxiosRequestConfig,
        requestTime: number,
        responseData: any
    ) {
        console.groupCollapsed(`${requestConfig.routeName}::${requestConfig.method}::${requestTime}s`);
        console.log([
            'URL: ', config.baseURL + requestConfig.url, '\n\n',
            'RequestTime: ', `${requestTime}s`, '\n\n',
            'Method: ', requestConfig.method, '\n\n',
            'Data: ', requestConfig.method === 'GET'
                ? JSON.stringify(requestConfig.params)
                : JSON.stringify(requestConfig.data), '\n\n',
            'X-Request-Id: ', config.headers['X-Request-Id'], '\n\n'
        ].join(''));

        console.groupCollapsed('Response');
        console.log(JSON.stringify(responseData, null, 2));
        console.groupEnd();

        console.groupEnd();
    }

    call(
        requestConfig: IAxiosRequestConfig,
        data = {},
        stringify: boolean = false
    ) {
        const timeStart = new Date().getTime();

        if (requestConfig.method === 'GET') {
            requestConfig.params = data;
        } else {
            requestConfig.data = stringify ? qs.stringify(data) : data;
        }

        emitter.emit('requestStart', {
            name: requestConfig.routeName,
            data,
            params: requestConfig.urlParams
        });
    
        return this.axiosInstance.request(requestConfig)
            .then((res) => {
                const requestTime = (new Date().getTime() - timeStart) / 1000;

                this.log(
                    res.config,
                    requestConfig,
                    requestTime,
                    res.data
                );

                emitter.emit('requestEnd', { name: requestConfig.routeName });

                return Promise.resolve(res);
            })
            .catch((res: AxiosError) => {
                const event: any = {
                    name: requestConfig.routeName
                };
                const requestTime = (new Date().getTime() - timeStart) / 1000;

                this.log(
                    res.config,
                    requestConfig,
                    requestTime,
                    res.response && res.response.data || {}
                );

                try {
                    const error: IError = requestConfig.errorResolver(res);
                    event.error = error;
                } catch(exx) {
                    const error: IError = {
                        code: 'unhandled.error',
                        description: 'Непонятная ошибка'
                    };
                    event.error = error;
                    console.log(exx);
                }

                event.error.details = {
                    url: res.config.baseURL + requestConfig.url,
                    data: requestConfig.method === 'GET'
                        ? JSON.stringify(requestConfig.params)
                        : JSON.stringify(requestConfig.data)
                };

                emitter.emit('requestEnd', event);

                return Promise.reject(res);
            });
    }
}

export const request = new Request();
export const webshopTransport = new Request();
