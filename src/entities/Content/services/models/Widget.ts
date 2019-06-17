import { IValue } from 'src/types/IValue';

interface AbstractSingleWidget {
    id?: number;
    imageId?: string;
    type: 'single';
    serviceId: string;
    size?: {
        width?: number;
        height?: number;
    };
}

export type IWidgetCollectionDispayTypes = 'carousel' | 'horizontalScroll' | 'verticalScroll';
export type TSocialType = 'twitter' | 'youtube' | 'facebook' | 'vkontakte' | 'twitch' | 'instagram' | 'discord' | 'forum';

export interface IWidgetProduct extends AbstractSingleWidget {
    data: {
        productId: number;
        type: 'product';
    };
}

export interface IWidgetTimer extends AbstractSingleWidget {
    data: {
        buttonText?: IValue;
        data?: string;
        finishDate?: string;
        intervalSeconds?: number;
        intervalStartDate?: string;
        target?: string;
        text?: IValue;
        type: 'timer';
        serviceId: string;
    };
}

export interface IWidgetPbCollections extends AbstractSingleWidget {
    data: {
        type: 'pbCollections';
        achievementIds: Array<number>;
    };
}

export interface IWidgetPbTop extends AbstractSingleWidget {
    data: {
        type: 'pbTop'
    }
}

export interface IWidgetNews extends AbstractSingleWidget {
    data: {
        newsFeedId: string;
        theme: string;
        type: 'news'     
    };
}

export interface IWidgetBanner extends AbstractSingleWidget {
    data: {
        data: string;
        label: IValue;
        target: string;
        title: IValue;
        type: 'banner';
    };
}

export interface IWidgetVideo extends AbstractSingleWidget {
    data: {
        link: string;
        source: 'youtube' | 'vimeo';
        type: 'video';
        text: IValue;
    };
}

export interface IWidgetSocial extends AbstractSingleWidget {
    data: {
        type: 'social';
        list: Array<{
            followers?: string;
            id: string;
            url?: string;
            type: TSocialType;
        }>;
    };
}

export interface IWidgetProductsCollection extends AbstractSingleWidget {
    data: {
        source: {
            serviceId: null | number;
            categoryId: null | number;
            sorting: string;
            sortingDirection: string;
        };
        type: 'productsCollection';
    };
}

interface IAbstractWidgetCollection {
    id?: number;
    type: 'collection';
    display: IWidgetCollectionDispayTypes;
    serviceId: string;
    title?: IValue;
    size: {
        width?: number;
        height?: number;
    };
}

export interface IWidgetCollection extends IAbstractWidgetCollection {
    widgets: Array<IWidgetProductsCollection | IWidgetProduct | IWidgetBanner | IWidgetVideo>;
}

export interface IWidgetCollectionRequestType extends IAbstractWidgetCollection {
    widgets: Array<number>;
}

export type IWidgetSingle = IWidgetProductsCollection
    | IWidgetNews
    | IWidgetProduct
    | IWidgetBanner
    | IWidgetVideo
    | IWidgetSocial
    | IWidgetPbCollections
    | IWidgetPbTop
    | IWidgetTimer;
