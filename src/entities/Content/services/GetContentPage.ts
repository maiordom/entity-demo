import compact from 'lodash/compact';
import { AxiosResponse } from 'axios';
import moment from 'moment';

import { request } from 'src/utils/Request';
import routes, { TRouteHandler } from 'src/routes/api';
import { DATE_LONG_FORMAT } from 'src/constants';

import {
    IWidgetBanner,
    IWidgetCollection,
    IWidgetProduct,
    IWidgetProductsCollection,
    IWidgetSocial,
    IWidgetVideo,
    IWidgetNews,
    IWidgetPbCollections,
    IWidgetPbTop,
    IWidgetTimer
} from '../store';

import {
    IWidgetBanner as IWidgetBannerResponseType,
    IWidgetCollection as IWidgetCollectionResponseType,
    IWidgetProduct as IWidgetProductResponseType,
    IWidgetProductsCollection as IWidgetProductsCollectionResponseType,
    IWidgetSingle as IWidgetSingleResponseType,
    IWidgetSocial as IWidgetSocialResponseType,
    IWidgetVideo as IWidgetVideoResponseType,
    IWidgetNews as IWidgetNewsResponseType,
    IWidgetPbCollections as IWidgetPbCollectionsResponseType,
    IWidgetPbTop as IWidgetPbTopResponseType,
    IWidgetTimer as IWidgetTimerResponseType
} from './models/Widget';

export interface IGetContentPageResponseType {
    data: {
        widgets: Array<IWidgetSingleResponseType | IWidgetCollectionResponseType>;
    };
}

const getCollection = (item: IWidgetCollectionResponseType) => ({
    id: item.id,
    display: item.display,
    title: {
        ru: item.title && item.title.ru,
        en: item.title && item.title.en,
        pt: item.title && item.title.pt
    },
    size: {
        width: item.size.width
    },
    type: 'collection',
    widgets: compact(item.widgets.map((widget) => {
        switch (widget.data.type) {
            case 'productsCollection':
                return getProductCollection(widget as IWidgetProductsCollectionResponseType);

            case 'banner':
                return getBanner(widget as IWidgetBannerResponseType);

            case 'video':
                return getVideo(widget as IWidgetVideoResponseType);
        }
    }))
} as IWidgetCollection);

const getProductCollection = (widget: IWidgetProductsCollectionResponseType) => ({
    id: widget.id,
    serviceId: widget.serviceId,
    type: 'productsCollection',
    source: {
        serviceId: widget.data.source.serviceId,
        categoryId: widget.data.source.categoryId,
        sorting: widget.data.source.sorting,
        sortingDirection: widget.data.source.sortingDirection
    }
} as IWidgetProductsCollection);

const getPbTop = (widget: IWidgetPbTopResponseType) => ({
    id: widget.id,
    serviceId: widget.serviceId,
    type: 'pbTop',
    size: {
        width: widget.size.width || 4
    }
} as IWidgetPbTop);

const getBanner = (widget: IWidgetBannerResponseType) => ({
    id: widget.id,
    imageId: widget.imageId,
    type: 'banner',
    size: {
        width: widget.size.width
    },
    source: {
        data: widget.data.data,
        label: {
            ru: widget.data.label.ru,
            en: widget.data.label.en,
            pt: widget.data.label.pt
        },
        target: widget.data.target,
        title: {
            ru: widget.data.title.ru,
            en: widget.data.title.en,
            pt: widget.data.title.pt
        }
    }
} as IWidgetBanner);

const getTimer = (widget: IWidgetTimerResponseType) => ({
    id: widget.id,
    imageId: widget.imageId,
    source: {
        buttonText: widget.data.buttonText,
        data: widget.data.data,
        finishDate: widget.data.finishDate && moment(widget.data.finishDate).format(DATE_LONG_FORMAT),
        intervalSeconds: widget.data.intervalSeconds,
        intervalStartDate: widget.data.intervalStartDate && moment(widget.data.intervalStartDate).format(DATE_LONG_FORMAT),
        target: widget.data.target,
        text: widget.data.text,
        serviceId: widget.serviceId
    },
    size: {
        width: widget.size.width,
        height: widget.size.height
    },
    type: 'timer'
} as IWidgetTimer);

const getVideo = (widget: IWidgetVideoResponseType) => ({
    id: widget.id,
    imageId: widget.imageId,
    serviceId: widget.serviceId,
    type: 'video',
    size: {
        width: widget.size.width
    },
    source: {
        link: widget.data.link,
        source: 'youtube',
        type: 'video',
        text: {
            ru: widget.data.text.ru,
            en: widget.data.text.en,
            pt: widget.data.text.pt
        }
    }
} as IWidgetVideo);

const getAchievements = (widget: IWidgetPbCollectionsResponseType) => ({
    id: widget.id,
    size: {
        width: widget.size.width
    },
    serviceId: widget.serviceId,
    type: widget.data.type,
    source: {
        achievementIds: widget.data.achievementIds
    }
} as IWidgetPbCollections);

const getSocial = (widget: IWidgetSocialResponseType) => ({
    id: widget.id,
    type: 'social',
    serviceId: widget.serviceId,
    size: {
        width: widget.size.width
    },
    source: widget.data.list.map((social) => ({
        id: social.id,
        url: social.url,
        followers: social.followers ? String(social.followers) : '',
        type: social.type
    }))
} as IWidgetSocial);

const getProduct = (widget: IWidgetProductResponseType) => ({
    id: widget.id,
    serviceId: widget.serviceId,
    type: 'product',
    size: {
        width: widget.size.width || 4
    },
    source: {
        id: widget.data.productId
    }
} as IWidgetProduct);

const getNews = (widget: IWidgetNewsResponseType) => ({
    id: widget.id,
    serviceId: widget.serviceId,
    type: 'news',
    size: {
        width: widget.size.width
    },
    source: {
        newsFeedId: widget.data.newsFeedId,
        theme: widget.data.theme
    },
    news: []
} as IWidgetNews);

const getSingle = (widget: IWidgetSingleResponseType) => {
    switch (widget.data.type) {
        case 'product':
            return getProduct(widget as IWidgetProductResponseType);

        case 'video':
            return getVideo(widget as IWidgetVideoResponseType);

        case 'banner':
            return getBanner(widget as IWidgetBannerResponseType);

        case 'social':
            return getSocial(widget as IWidgetSocialResponseType);

        case 'news':
            return getNews(widget as IWidgetNewsResponseType);

        case 'pbCollections':
            return getAchievements(widget as IWidgetPbCollectionsResponseType);

        case 'pbTop':
            return getPbTop(widget as IWidgetPbTopResponseType);

        case 'timer':
            return getTimer(widget as IWidgetTimerResponseType);
    }
};

export type IGetContentPageRequestParams = {
    pageId: number;
};

export const getContentPage = (params: IGetContentPageRequestParams) =>
    request.call(
        (routes.content.getContentPage as TRouteHandler)(params)
    ).then(({ data: { data } }: AxiosResponse<IGetContentPageResponseType>) =>
        (data.widgets || []).map((item) => {
            if (item.type === 'single') {
                return getSingle(item);
            }

            return getCollection(item);
        }).filter(widget => widget)
    );

export default getContentPage;
