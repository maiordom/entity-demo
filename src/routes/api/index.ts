import each from 'lodash/each';
import { AxiosError } from 'axios';

export { TImportType, TExportType } from './webshop'; 

import gameAuthRoutes from './gameAuth';
import groupManagerRoutes from './groupManager';
import contentRoutes from './content';
import claimRoutes from './claim';
import rolesRoutes from './roles';
import codesRoutes from './codes';
import accountsRoutes from './accounts';
import documentsRoutes from './documents';
import eventsRoutes from './events';
import mediaRoutes from './media';
import imagesRoutes from './images';
import webshopRoutes from './webshop';
import adminRoutes from './admin';
import jobsRoutes from './jobs';
import subscriptionRoutes from './subscription';
import gameShopRoutes from './gameShop';
import authRoutes from './auth';
import billingRoutes from './billing';
import statusMonitorRoutes from './statusMonitor';
import webshopCategoriesRoutes from './webshopCategories';
import newsFeedsRoutes from './newsFeeds';
import newsRoutes from './news';
import promoCodesRoutes from './promoCodes';
import achievementsRoutes from './achievements';

import { IError } from 'src/store';

interface ISignInResponseError {
    error: string | IServiceError;
    error_code: string;
    error_description: string;
}

interface IServiceError {
    code: string;
    description: string;
}

export const defaultErrorResolver = (res: AxiosError) => {
    const { code, description } = res.response.data.error;

    return {
        code,
        description
    } as IError;
};

export const authErrorResolver: TErrorResolver = (res: AxiosError) => {
    const data: ISignInResponseError = res.response.data;
    let {
        error,
        error_code: code,
        error_description: description
    } = data;

    // response status 500 for example
    if (typeof error === 'object') {
        code = error.code;
        description = error.description;
    }

    return {
        code: code || error,
        description: description || error
    } as IError;
};

type TErrorResolver = (res: AxiosError) => IError;

type TRouteHandlerOriginal = (params: any) => TRoute;
export type TRouteHandler = TRouteHandlerOriginal & { routeName?: string; };

export type TRoute = {
    method: string;
    headers?: {
        [key: string]: string;
    };
    errorResolver?: TErrorResolver;
    url: string;
    routeName?: string;
    claim?: string;
};

interface IApi {
    [key: string]: {
        [key: string]: TRoute | TRouteHandler;
    };
}

const api: IApi = {
    gameAuth: gameAuthRoutes,
    groupManager: groupManagerRoutes,
    content: contentRoutes,
    claim: claimRoutes,
    roles: rolesRoutes,
    codes: codesRoutes,
    accounts: accountsRoutes,
    documents: documentsRoutes,
    events: eventsRoutes,
    media: mediaRoutes,
    images: imagesRoutes,
    webshop: webshopRoutes,
    admin: adminRoutes,
    jobs: jobsRoutes,
    subscription: subscriptionRoutes,
    gameShop: gameShopRoutes,
    auth: authRoutes,
    billing: billingRoutes,
    statusMonitor: statusMonitorRoutes,
    webshopCategories: webshopCategoriesRoutes,
    newsFeeds: newsFeedsRoutes,
    news: newsRoutes,
    promoCodes: promoCodesRoutes,
    achievements: achievementsRoutes
};

each(api, (routesGroup) => {
    each(routesGroup, (route, routeName) => {
        if (route.constructor === Function) {
            const routeHandler: TRouteHandler = function(...args) {
                const newRoute = Object.assign({
                    routeName,
                    urlParams: args[0],
                    ...route(...args)
                });

                if (!newRoute.errorResolver) {
                    newRoute.errorResolver = defaultErrorResolver;
                }

                return newRoute;
            };

            routeHandler.routeName = routeName;
            routesGroup[routeName] = routeHandler;
        } else {
            route.routeName = routeName;

            if (!route.errorResolver) {
                route.errorResolver = defaultErrorResolver;
            }
        }
    });
});

export default api;
