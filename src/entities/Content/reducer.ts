import { handleActions } from 'redux-actions';
import findIndex from 'lodash/findIndex';
import reject from 'lodash/reject';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

import { IAction } from 'src/types/IAction';
import * as a from './actions';
import { IStore } from 'src/store';
import { INewsArticle } from 'src/entities/Content/store';

import {
    getSelectedPage,
    getSelectedWidgetCollection,
    getSelectedNewsWidget
} from './store';

const sortNews = (news: Array<INewsArticle>) => news.sort((a, b) => {
    if ((new Date(a.whenPublished)).getTime() > (new Date(b.whenPublished)).getTime()) { return -1; }
    if ((new Date(a.whenPublished)).getTime() < (new Date(b.whenPublished)).getTime()) { return 1; }
    return 0;
});

export default handleActions({
    [a.removeCollectionWidget.name]: (state: IStore, { payload: { widgetId } }: IAction<a.IRemoveCollectionWidgetParams>) => {
        const collectionWidget = state.content.selectedWidgetCollection;

        collectionWidget.widgets = reject(collectionWidget.widgets, { id: widgetId });
        state.content.selectedWidgetCollection = {...collectionWidget};

        return state;
    },

    [a.removeWidget.name]: (state: IStore, { payload: { widgetId } }: IAction<a.IRemoveWidgetParams>) => {
        const page = state.content.selected;

        page.widgets = reject(page.widgets, { id: widgetId });
        state.content.selected = {...page};

        return state;
    },

    [a.deleteContentPageAction.name]: (state: IStore, { payload: { pageId, serviceId } }: IAction<a.IDeleteContentPageParams>) => {
        const items = state.content.items[serviceId];
        const nextItemsState = reject(items, { id: pageId });

        state.content.items[serviceId] = [...nextItemsState];

        return state;
    },

    [a.updateContentCollectionWidget.name]: (state: IStore, { payload: {
        widget,
        widgetId
    } }: IAction<a.IUpdateContentCollectionWidgetParams>) => {
        const collectionWidget = state.content.selectedWidgetCollection;
        const widgetIndex = findIndex(collectionWidget.widgets, { id: widgetId });

        collectionWidget.widgets[widgetIndex] = widget;
        state.content.selectedWidgetCollection = {...collectionWidget};

        return state;
    },

    [a.removeNewsWidgetItem.name]: (state: IStore, { payload: { news } }: IAction<a.IRemoveNewsWidgetItemParams>) => {
        state.content.selectedNewsWidget.news = reject(state.content.selectedNewsWidget.news, { id: news.id });
        state.content.selectedNewsWidget = {...state.content.selectedNewsWidget};
        return state;
    },

    [a.updateNewsWidgetSource.name]: (state: IStore, { payload: { source } }: IAction<a.IUpdateNewsWidgetSourceParams>) => {
        Object.assign(state.content.selectedNewsWidget.source, source);
        return state;
    },

    [a.setNewsWidgetItem.name]: (state: IStore, { payload: { news } }: IAction<a.ISetNewsWidgetItemParams>) => {
        const newsWidget = state.content.selectedNewsWidget;

        news.whenPublished = moment(news.whenPublished).format('YYYY.MM.DD HH:mm');
        newsWidget.news.push(news);
        sortNews(newsWidget.news);
        state.content.selectedNewsWidget = {...newsWidget};

        return state;
    },

    [a.updateNewsWidgetItem.name]: (state: IStore, { payload: { news } }: IAction<a.IUpdateNewsWidgetItemParams>) => {
        const newsWidget = state.content.selectedNewsWidget;
        const newsIndex = findIndex(newsWidget.news, { id: news.id });

        news.whenPublished = moment(news.whenPublished).format('YYYY.MM.DD HH:mm');
        newsWidget.news[newsIndex] = news;
        sortNews(newsWidget.news);
        state.content.selectedNewsWidget = {...state.content.selectedNewsWidget};

        return state;
    },

    [a.updateContentWidget.name]: (state: IStore, { payload: { widget, widgetId } }: IAction<a.IUpdateContentWidgetParams>) => {
        const page = state.content.selected;
        const widgetIndex = findIndex(page.widgets, { id: widgetId });

        state.content.selected = {...page};
        page.widgets[widgetIndex] = widget;

        return state;
    },

    [a.updateContentPageAction.name]: (state: IStore, { payload: { changes, contentPage } }: IAction<a.IUpdateContentPageParams>) => {
        Object.keys(changes).forEach(key => {
            contentPage[key] = changes[key];
        });
        return state;
    },

    [a.setContentPages.name]: (state: IStore, { payload: { pages, serviceId } }: IAction<a.ISetContentPagesParams>) => {
        pages.sort((item) => item.isDefault ? 0 : 1);
        state.content.items[serviceId] = pages;
        return state;
    },

    [a.setContentWidget.name]: (state: IStore, { payload: { widget } }: IAction<a.ISetContentWidgetParams>) => {
        const page = state.content.selected;

        state.content.selected = {...page};
        page.widgets.push(widget);

        return state;
    },

    [a.setContentPage.name]: (state: IStore, { payload: { serviceId, page } }: IAction<a.ISetContentPageParams>) => {
        const pageIndex = findIndex(state.content.items[serviceId], { id: page.id });

        if (pageIndex >= 0) {
            state.content.items[serviceId][pageIndex] = page;
        } else {
            state.content.items[serviceId].push(page);
        }

        return state;
    },

    [a.selectContentPage.name]: (state: IStore, { payload: { page } }: IAction<a.ISelectContentPageParams>) => {
        state.content.selected = page;
        return state;
    },

    [a.selectCollectionWidget.name]: (state: IStore, { payload: { widget } }: IAction<a.ISelectCollectionWidgetParams>) => {
        state.content.selectedWidgetCollection = cloneDeep(widget);
        return state;
    },

    [a.selectNewsWidget.name]: (state: IStore, { payload: { widget } }: IAction<a.ISelectNewsWidgetParams>) => {
        state.content.selectedNewsWidget = widget;
        return state;
    },

    [a.setContentCollectionWidget.name]: (state: IStore, { payload: { widget } }: IAction<a.ISetContentCollectionWidgetParams>) => {
        const collection = state.content.selectedWidgetCollection;

        state.content.selectedWidgetCollection = {...collection};
        state.content.selectedWidgetCollection.widgets.push(widget);

        return state;
    },

    [a.clearSelectedCollectionWidget.name]: (state: IStore) => {
        state.content.selectedWidgetCollection = getSelectedWidgetCollection();
        return state;
    },

    [a.clearSelectedContentPage.name]: (state: IStore) => {
        state.content.selected = getSelectedPage();
        return state;
    },

    [a.clearSelectedNewsWidget.name]: (state: IStore) => {
        state.content.selectedNewsWidget = getSelectedNewsWidget();
        return state;
    }
}, {});