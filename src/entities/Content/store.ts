import { IValue } from 'src/types/IValue';
import { INews } from 'src/entities/News/models/News';

interface AbstractWidget {
    id?: number;
    serviceId?: string;
    status?: 'error';
    statusText?: string;
    size?: {
        width?: number;
        height?: number;
    };
}

export interface IWidgetProductsCollectionSource {
    serviceId: null | number;
    categoryId: null | number;
    sorting: string;
    sortingDirection: string;
}

import { IProduct as IProductCard } from 'src/entities/Product/store';

export interface IWidgetProductsCollection extends AbstractWidget {
    items: Array<IProductCard>;
    source: IWidgetProductsCollectionSource;
    type: 'productsCollection';
}

export interface INewsArticle extends INews {}

export interface ITimerCard {
    buttonText?: IValue;
    data?: string;
    finishDate?: string;
    intervalSeconds?: number;
    intervalStartDate?: string;
    target?: string;
    text?: IValue;
    serviceId: string;
}

export interface IWidgetTimer extends AbstractWidget {
    imageId?: string;
    imageUrl?: string;
    source: ITimerCard;
    type: 'timer';
}

export interface IWidgetPbCollections extends AbstractWidget {
    type: 'pbCollections';
    source: {
        achievementIds: Array<number>;
    };
}

export interface IWidgetPbTop extends AbstractWidget {
    type: 'pbTop';
}

export interface IWidgetNews extends AbstractWidget {
    type: 'news';
    source: IWidgetNewsSource;
    news: Array<INewsArticle>;
}

export interface IWidgetNewsSource {
    newsFeedId?: string;
    theme?: string;
}

export interface IWidgetProduct extends AbstractWidget {
    type: 'product';
    source?: IProductCard;
}

export type TSocialType = 'twitter' |
    'youtube' |
    'facebook' |
    'vkontakte' |
    'twitch' |
    'instagram' |
    'discord' |
    'forum';

export type TWidgetSocialSource = Array<{
    followers?: string;
    id: string;
    url?: string;
    type: TSocialType;
}>;

export interface IWidgetSocial extends AbstractWidget {
    url?: string;
    type: 'social';
    source: TWidgetSocialSource;
}

export interface IWidgetBannerSource {
    data: string;
    imageUrl?: string;
    label: IValue;
    target: 'product' | 'externalLink';
    title: IValue;
}

export interface IWidgetBanner extends AbstractWidget {
    imageId: string;
    type: 'banner';
    source: IWidgetBannerSource;
}

export interface IWidgetVideoSource {
    imageUrl?: string;
    link: string;
    source: 'youtube' | 'vimeo';
    type: 'video';
    text: IValue;
}

export interface IWidgetVideo extends AbstractWidget {
    imageId?: string;
    type: 'video';
    source: IWidgetVideoSource;
}

export type IWidgetCollectionDispayTypes = 'carousel' |
    'horizontalScroll' |
    'verticalScroll';

export interface IAbstractWidgetCollection {
    serviceId?: string;
    display: IWidgetCollectionDispayTypes;
    title: IValue;
    id?: number;
    size?: {
        width?: number;
    };
}

export interface IWidgetCollection extends IAbstractWidgetCollection {
    type: 'collection';
    widgets: Array<IWidgetSingle>;
}

export type IWidgetSingle = IWidgetTimer
    | IWidgetPbTop
    | IWidgetBanner
    | IWidgetNews
    | IWidgetVideo
    | IWidgetProduct
    | IWidgetSocial
    | IWidgetPbCollections;
export type IWidget = IWidgetCollection | IWidgetSingle;
export type TContentPageWidget = IWidgetCollection |
    IWidgetProductsCollection |
    IWidgetSingle;

export interface IContent {
    items: {
        [key: string]: Array<IContentPage>;
    };
    selectedWidgetCollection: IWidgetCollection;
    selected: IContentPage;
    selectedNewsWidget: IWidgetNews;
}

export interface IContentPage {
    id: number;
    name: string;
    region: string;
    slug: string;
    application: string;
    serviceId: string;
    isDefault: boolean;
    whenModified: string;
    widgets: Array<TContentPageWidget>;
}

export const getSelectedNewsWidget = (): IWidgetNews => ({
    id: null,
    type: 'news',
    serviceId: null,
    size: {
        width: null
    },
    source: {
        newsFeedId: null,
        theme: 'light'
    },
    news: []
});

export const getSelectedPage = (): IContentPage => ({
    id: null,
    name: null,
    region: null,
    slug: null,
    application: null,
    serviceId: null,
    isDefault: false,
    whenModified: null,
    widgets: []
});

export const getSelectedWidgetCollection = (): IWidgetCollection => ({
    id: null,
    size: {
        width: null
    },
    title: null,
    display: null,
    type: 'collection',
    widgets: []
});

export const content: IContent = {
    items: {},
    selectedWidgetCollection: getSelectedWidgetCollection(),
    selected: getSelectedPage(),
    selectedNewsWidget: getSelectedNewsWidget()
};
