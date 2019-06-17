import find from 'lodash/find';
import get from 'lodash/get';

import { createAction } from 'src/utils/CreateAction';

import getContentPagesService, { IGetContentPagesRequestParams } from './services/GetContentPages';
import getContentPageService, { IGetContentPageRequestParams } from './services/GetContentPage';
import createContentPageService, { ICreateContentPageRequestParams } from './services/CreateContentPage';
import updateContentPageService, { IUpdateContentPageRequestParams } from './services/UpdateContentPage';
import deleteContentPageService, { IDeleteContentPageRequestParams } from './services/DeleteContentPage';
import getNews from 'src/entities/News/services/GetNews';

import createCollectionService from './services/CreateCollection';

import createWidgetService, { ICreateWidgetRequestParams } from './services/CreateWidget';

import { IStore } from 'src/store';
import { IContentPage, IWidget, IWidgetCollection } from './store';
import {
    IWidgetSingle,
    IWidgetProduct,
    IWidgetBanner,
    IWidgetVideo,
    IWidgetSocial,
    INewsArticle,
    IWidgetNewsSource,
    IWidgetNews,
    IWidgetPbCollections,
    IWidgetPbTop,
    IWidgetTimer
} from './store';
import {
    IWidgetVideo as IWidgetVideoRequestType,
    IWidgetBanner as IWidgetBannerRequestType,
    IWidgetProduct as IWidgetProductRequestType,
    IWidgetSocial as IWidgetSocialRequestType,
    IWidgetNews as IWidgetNewsRequestType,
    IWidgetPbCollections as IWidgetPbCollectionsRequestType,
    IWidgetCollectionRequestType,
    IWidgetPbTop as IWidgetPbTopRequestType,
    IWidgetTimer as IWidgetTimerRequestType
} from './services/models/Widget';

export { IGetContentPagesRequestParams } from './services/GetContentPages';
export { IGetContentPageRequestParams } from './services/GetContentPage';

import { getProduct, IProduct } from 'src/entities/Product/actions';

export interface ISetContentPagesParams { pages: Array<IContentPage>; serviceId: string; };
export interface ISetContentWidgetParams { widget: IWidget; }
export interface ISetContentPageParams { page: IContentPage; serviceId: string; }
export interface ISelectContentPageParams { page: IContentPage; }
export interface IUpdateContentPageParams { changes: { name: string; }; contentPage: IContentPage; }
export interface IUpdateContentWidgetParams { widgetId: number; widget: IWidget; }
export interface IDeleteContentPageParams extends IDeleteContentPageRequestParams { serviceId: string; }
export interface ISetContentCollectionWidgetParams { widget: IWidgetSingle; }
export interface ISelectCollectionWidgetParams { widget: IWidgetCollection; }
export interface IUpdateContentCollectionWidgetParams { widgetId: number; widget: IWidgetSingle; }
export interface IReplaceWidgetsParams { widgetsIds: Array<number>; }
export interface IRemoveWidgetParams { widgetId: number; }
export interface IRemoveCollectionWidgetParams { widgetId: number; }
export interface IUpdateNewsWidgetSourceParams { source: IWidgetNewsSource; }
export interface ISetNewsWidgetItemParams { news: INewsArticle; }
export interface IRemoveNewsWidgetItemParams { news: INewsArticle; }
export interface ISelectNewsWidgetParams { widget: IWidgetNews; }
export interface IUpdateNewsWidgetItemParams { news: INewsArticle; }

export const {
    updateContentWidget,
    updateContentPageAction,
    setContentPages,
    setContentWidget,
    clearSelectedContentPage,
    setContentPage,
    selectContentPage,
    deleteContentPageAction,
    clearSelectedCollectionWidget,
    setContentCollectionWidget,
    selectCollectionWidget,
    updateContentCollectionWidget,
    replaceWidgets,
    removeWidget,
    removeCollectionWidget,
    updateNewsWidgetSource,
    setNewsWidgetItem,
    removeNewsWidgetItem,
    clearSelectedNewsWidget,
    selectNewsWidget,
    updateNewsWidgetItem
} = {
    updateContentWidget: (params: IUpdateContentWidgetParams) => createAction('updateContentWidget', params),
    updateContentPageAction: (params: IUpdateContentPageParams) => createAction('updateContentPageAction', params),
    setContentPages: (params: ISetContentPagesParams) => createAction('setContentPages', params),
    setContentWidget: (params: ISetContentWidgetParams) => createAction('setContentWidget', params),
    clearSelectedContentPage: () => createAction('clearSelectedContentPage'),
    setContentPage: (params: ISetContentPageParams) => createAction('setContentPage', params),
    selectContentPage: (params: ISelectContentPageParams) => createAction('selectContentPage', params),
    deleteContentPageAction: (params: IDeleteContentPageParams) => createAction('deleteContentPageAction', params),
    clearSelectedCollectionWidget: () => createAction('clearSelectedCollectionWidget'),
    setContentCollectionWidget: (params: ISetContentCollectionWidgetParams) => createAction('setContentCollectionWidget', params),
    selectCollectionWidget: (params: ISelectCollectionWidgetParams) => createAction('selectCollectionWidget', params),
    updateContentCollectionWidget: (params: IUpdateContentCollectionWidgetParams) => createAction('updateContentCollectionWidget', params),
    replaceWidgets: (params: IReplaceWidgetsParams) => createAction('replaceWidgets', params),
    removeWidget: (params: IRemoveWidgetParams) => createAction('removeWidget', params),
    removeCollectionWidget: (params: IRemoveCollectionWidgetParams) => createAction('removeCollectionWidget', params),
    updateNewsWidgetSource: (params: IUpdateNewsWidgetSourceParams) => createAction('updateNewsWidgetSource', params),
    setNewsWidgetItem: (params: ISetNewsWidgetItemParams) => createAction('setNewsWidgetItem', params),
    removeNewsWidgetItem: (params: IRemoveNewsWidgetItemParams) => createAction('removeNewsWidgetItem', params),
    clearSelectedNewsWidget: () => createAction('clearSelectedNewsWidget'),
    selectNewsWidget: (params: ISelectNewsWidgetParams) => createAction('selectNewsWidget', params),
    updateNewsWidgetItem: (params: IUpdateNewsWidgetItemParams) => createAction('updateNewsWidgetItem', params)
};

export const deleteContentPage = (
    params: IDeleteContentPageParams
) => (dispatch) => deleteContentPageService({ pageId: params.pageId }).then(() => {
    dispatch(deleteContentPageAction(params));
});

export const getContentPages = (
    params: IGetContentPagesRequestParams
) => (dispatch) => getContentPagesService(params).then(res => {
    dispatch(setContentPages({
        serviceId: params.serviceId,
        pages: res
    }));
}).catch(() => {
    dispatch(setContentPages({
        serviceId: params.serviceId,
        pages: []
    }));
});

export const getContentPage = (
    serviceId: string,
    contentPage: IContentPage,
    params: IGetContentPageRequestParams
) => (dispatch, getState: () => IStore) => {
    const state = getState();
    const imageTemplateUrl = state.imagesGroups.widgets && state.imagesGroups.widgets.launcherCol2 || '';

    return getContentPageService(params).then(widgets => {
        const { permissions } = getState().user;
        const promises = [];

        const hasClaimReadProduct = 'w.p.r' in permissions && permissions['w.p.r'].includes(serviceId);
        const hasClaimReadNews = 'news.f.r' in permissions && permissions['news.f.r'].includes(serviceId);
        const hasClaimReadPbCollections = 'r.pb.t.r' in permissions && permissions['r.pb.t.r'].includes(serviceId);

        widgets.forEach(widget => {
            if (widget.type === 'product') {
                if (!hasClaimReadProduct) {
                    widget.status = 'error';
                    widget.statusText = 'Нет прав на чтение товаров';
                    return;
                }

                const productId = widget.source.id;
                const promise = dispatch(getProduct({ productId })).then((res: IProduct) => {
                    widget.source = res;
                    return widget;
                });

                promises.push(promise)
            }

            if (widget.type === 'pbCollections' && !hasClaimReadPbCollections) {
                widget.status = 'error';
                widget.statusText = 'Нет прав на чтение ПБ коллекций';
            }

            if (widget.type === 'news') {
                if (!hasClaimReadNews) {
                    widget.status = 'error';
                    widget.statusText = 'Нет прав на чтение новостей';
                    return;
                }

                const promise = getNews({ feedId: widget.source.newsFeedId }).then(({ news }) => {
                    widget.news = news;
                    return widget;
                })
                promises.push(promise);
            }

            if (widget.type === 'collection') {
                widget.widgets.forEach(widget => {
                    if (['video', 'banner'].includes(widget.type)) {
                        (widget as IWidgetBanner | IWidgetVideo).source.imageUrl = imageTemplateUrl
                            .replace('{id}', String((widget as IWidgetBanner | IWidgetVideo).imageId));
                    }
                });
            }

            if (['video', 'banner'].includes(widget.type)) {
                const imageId = String((widget as IWidgetBanner | IWidgetVideo).imageId);

                if (imageId) {
                    (widget as IWidgetBanner | IWidgetVideo).source.imageUrl = imageTemplateUrl
                        .replace('{id}', imageId);
                }
            }

            if (['timer'].includes(widget.type)) {
                const imageTemplateUrl = get(state, 'imagesGroups.widgets.launcherCol1') || '';
                const imageId = String((widget as IWidgetTimer).imageId);

                if (imageId) {
                    (widget as IWidgetTimer).imageUrl = imageTemplateUrl
                        .replace('{id}', imageId);
                }
            }
        });

        return Promise.all(promises).then(() => {
            contentPage.widgets = widgets;
            dispatch(setContentPage({ serviceId, page: contentPage }));
        }).catch(() => {
            Promise.resolve();
        });
    });
};

export const createContentPage = (
    name: string,
    serviceId: string,
    contentPage: IContentPage,
    widgets: Array<number>
) => (dispatch, getState: () => IStore) => {
    const state = getState();
    const defaultPage = find(state.content.items[serviceId], { isDefault: true });

    const params: ICreateContentPageRequestParams = {
        page: {
            widgets,
            name,
            isDefault: false,
            slug: defaultPage.slug,
            application: defaultPage.application,
            region: defaultPage.region,
            serviceId: defaultPage.serviceId
        }
    };

    return createContentPageService(params).then(res => {
        contentPage.id = res.id;

        dispatch(setContentPage({ page: contentPage, serviceId: serviceId }));

        return res;
    });
};

export const updateContentPage = (
    name: string,
    contentPage: IContentPage,
    widgets: Array<number>
) => (dispatch) => {
    const params: IUpdateContentPageRequestParams = {
        page: {
            id: contentPage.id,
            widgets,
            name,
            isDefault: contentPage.isDefault,
            slug: contentPage.slug,
            application: contentPage.application,
            region: contentPage.region,
            serviceId: contentPage.serviceId
        }
    };

    return updateContentPageService(params).then(() => {
        dispatch(updateContentPageAction({ changes: { name }, contentPage }));
    });
};

export const createSocialWidget = (widget: IWidgetSocial) => () => {
    const params: ICreateWidgetRequestParams<IWidgetSocialRequestType> = {
        widget: {
            type: 'single',
            serviceId: widget.serviceId,
            size: {
                width: widget.size.width
            },
            data: {
                type: 'social',
                list: widget.source
            }
        }
    };

    return createWidgetService(params).then(res => {
        widget.id = res.id;
        widget.url = res.url;
        return widget;
    });
};

export const createTimerWidget = (widget: IWidgetTimer) => () => {
    const params: ICreateWidgetRequestParams<IWidgetTimerRequestType> = {
        widget: {
            type: 'single',
            serviceId: widget.serviceId,
            imageId: widget.imageId,
            size: {
                width: widget.size.width
            },
            data: {
                type: 'timer',
                ...widget.source
            }
        }
    };

    return createWidgetService(params).then(res => {
        widget.id = res.id;
        return widget;
    });
};

export const createNewsWidget = (widget: IWidgetNews) => () => {
    const params: ICreateWidgetRequestParams<IWidgetNewsRequestType> = {
        widget: {
            type: 'single',
            serviceId: widget.serviceId,
            size: {
                width: widget.size.width
            },
            data: {
                newsFeedId: widget.source.newsFeedId,
                type: 'news',
                theme: widget.source.theme
            }
        }
    };

    return createWidgetService(params).then(res => {
        widget.id = res.id;
        return widget;
    });
};

export const createCollectionWidget = (widget: IWidgetCollection) => () => {
    const params: ICreateWidgetRequestParams<IWidgetCollectionRequestType> = {
        widget: {
            type: 'collection',
            display: widget.display,
            serviceId: widget.serviceId,
            size: {
                width: widget.size.width
            },
            widgets: widget.widgets.map(item => item.id)
        }
    };

    return createCollectionService(params).then(res => {
        widget.id = res.id;
        return widget;
    });
};

export const createVideoWidget = (widget: IWidgetVideo) => (dispatch, getState: () => IStore) => {
    const params: ICreateWidgetRequestParams<IWidgetVideoRequestType> = {
        widget: {
            type: 'single',
            serviceId: widget.serviceId,
            imageId: widget.imageId,
            size: {
                width: widget.size.width
            },
            data: {
                type: 'video',
                link: widget.source.link,
                source: widget.source.source,
                text: widget.source.text
            }
        }
    };

    return createWidgetService(params).then(res => {
        const imageTemplateUrl = getState().imagesGroups.widgets.launcherCol2 || '';

        widget.id = res.id;
        widget.source.imageUrl = imageTemplateUrl
            .replace('{id}', String(widget.imageId));

        return widget;
    });
};

export const createPbCollectionsWidget = (
    widget: IWidgetPbCollections
) => () => {
    const params: ICreateWidgetRequestParams<IWidgetPbCollectionsRequestType> = {
        widget: {
            type: 'single',
            serviceId: widget.serviceId,
            size: {
                width: widget.size.width
            },
            data: {
                type: 'pbCollections',
                achievementIds: widget.source.achievementIds
            }
        }
    };

    return createWidgetService(params).then((res) => {
        widget.id = res.id;

        return widget;
    });
};

export const createPbTopWidget = (
    widget: IWidgetPbTop
) => () => {
    const params: ICreateWidgetRequestParams<IWidgetPbTopRequestType> = {
        widget: {
            type: 'single',
            serviceId: widget.serviceId,
            size: {
                width: widget.size.width
            },
            data: {
                type: 'pbTop'
            }
        }
    };

    return createWidgetService(params).then((res) => {
        widget.id = res.id;

        return widget;
    });
};

export const createBannerWidget = (
    widget: IWidgetBanner
) => (dispatch, getState: () => IStore) => {
    const { source } = widget;

    const params: ICreateWidgetRequestParams<IWidgetBannerRequestType> = {
        widget: {
            type: 'single',
            serviceId: widget.serviceId,
            imageId: widget.imageId,
            size: {
                width: widget.size.width
            },
            data: {
                data: source.data,
                label: source.label,
                target: source.target,
                title: source.title,
                type: 'banner'
            }
        }
    };

    return createWidgetService(params).then((res) => {
        const imageTemplateUrl = getState().imagesGroups.widgets.launcherCol2 || '';

        widget.id = res.id;
        widget.source.imageUrl = imageTemplateUrl
            .replace('{id}', String(widget.imageId));

        return widget;
    });
};

export const createProductWidget = (
    productWidget: IWidgetProduct
) => (dispatch, getState: () => IStore) => {
    let params: ICreateWidgetRequestParams<IWidgetProductRequestType> = {
        widget: {
            type: 'single',
            serviceId: productWidget.serviceId,
            size: {
                width: productWidget.size.width
            },
            data: {
                productId: productWidget.source.id,
                type: 'product'
            }
        }
    };

    const productId = productWidget.source.id;

    return createWidgetService(params)
        .then((res) => {
            productWidget.id = res.id;
        }).then(() =>
            dispatch(getProduct({ productId })).then((res: IProduct) => {
                productWidget.source = res;
                return productWidget;
            })
        );
};
