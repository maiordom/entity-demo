import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import debounce from 'lodash/debounce';
import Packery  from 'packery';
import Draggabilly from 'draggabilly';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import PbTop from 'src/components/Widgets/PbTop';
import ProductCard from 'src/components/Widgets/ProductCard';
import PbCollections from 'src/components/Widgets/PbCollections';
import News from 'src/components/Widgets/News';
import Banners from 'src/components/Widgets/Banners/Banners';
import Banner from 'src/components/Widgets/Banner/Banner';
import Video from 'src/components/Widgets/Video/Video';
import SocialPanel from 'src/components/Widgets/SocialPanel/SocialPanel';
import { Error } from 'src/components/Form/Form';
import Timer from 'src/components/Widgets/Timer';

import { IImagesGroups } from 'src/entities/ImagesGroups/store';
import { Container, Inner, GridCell } from 'src/components/Layout/Layout';
import { IOption } from 'src/components/Apps/Apps';
import { IAreaItem } from 'src/entities/Area/store';
import AddWidget from 'src/components/Widgets/AddWidget/AddWidget';
import Constructor, {
    WIDGET_TYPE_BANNER,
    WIDGET_TYPE_BANNERS,
    WIDGET_TYPE_NEWS,
    WIDGET_TYPE_PB_COLLECTIONS,
    WIDGET_TYPE_PB_TOP
} from 'src/components/Widgets/Constructor/Constructor';
import NewsArticle from 'src/components/Widgets/Constructor/NewsArticle';
import Overlay from 'src/components/Overlay/Overlay';
import Panel from 'src/components/Panel/Panel';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

import api from 'src/routes/api';

import clientRoutes from 'src/routes/client';

import { IStore } from 'src/store';

import { clearSelectedNewsWidget } from 'src/entities/Content/actions';
import { getContentPages, IGetContentPagesRequestParams } from 'src/entities/Content/actions';
import { selectNewsWidget, ISelectNewsWidgetParams } from 'src/entities/Content/actions';
import { removeCollectionWidget, IRemoveCollectionWidgetParams } from 'src/entities/Content/actions';
import { removeWidget, IRemoveWidgetParams } from 'src/entities/Content/actions';
import { createNewsWidget } from 'src/entities/Content/actions';
import { createPbTopWidget } from 'src/entities/Content/actions';
import { createTimerWidget } from 'src/entities/Content/actions';
import { createPbCollectionsWidget } from 'src/entities/Content/actions';
import { createCollectionWidget } from 'src/entities/Content/actions';
import { createVideoWidget } from 'src/entities/Content/actions';
import { createSocialWidget } from 'src/entities/Content/actions';
import { createBannerWidget } from 'src/entities/Content/actions';
import { updateContentWidget, IUpdateContentWidgetParams } from 'src/entities/Content/actions';
import { createContentPage } from 'src/entities/Content/actions';
import { createProductWidget } from 'src/entities/Content/actions';
import { clearSelectedContentPage } from 'src/entities/Content/actions';
import { setContentWidget, ISetContentWidgetParams } from 'src/entities/Content/actions';
import { updateContentPage } from 'src/entities/Content/actions';
import { setContentCollectionWidget, ISetContentCollectionWidgetParams } from 'src/entities/Content/actions';
import { clearSelectedCollectionWidget } from 'src/entities/Content/actions';
import { selectCollectionWidget, ISelectCollectionWidgetParams } from 'src/entities/Content/actions';
import { updateContentCollectionWidget, IUpdateContentCollectionWidgetParams } from 'src/entities/Content/actions';

import {
    IWidget,
    IWidgetCollection,
    IWidgetPbCollections,
    IWidgetSingle,
    IWidgetProduct,
    IWidgetBanner,
    IWidgetVideo,
    IContentPage,
    IWidgetSocial,
    INewsArticle,
    IWidgetNews,
    IWidgetPbTop,
    IWidgetTimer
} from 'src/entities/Content/store';

export interface IProps {
    imagesGroups: IImagesGroups;
    area: IAreaItem;
    type?: 'create' | 'edit';
    app: IOption;
    selectedWidgetCollection: IWidgetCollection;
    selectedNewsWidget: IWidgetNews;
    pageContent: IContentPage;
    loaders?: {
        createContentPage: boolean;
        updateContentPage: boolean;
    };
}

export interface IActions {
    actions: {
        getContentPages: (params: IGetContentPagesRequestParams) => void;
        removeCollectionWidget: (params: IRemoveCollectionWidgetParams) => void;
        removeWidget: (params: IRemoveWidgetParams) => void;
        updateContentCollectionWidget: (params: IUpdateContentCollectionWidgetParams) => void;
        selectCollectionWidget: (params: ISelectCollectionWidgetParams) => void;
        clearSelectedCollectionWidget: () => void;
        clearSelectedNewsWidget: () => void;
        createCollectionWidget: (widget: IWidgetCollection) => Promise<void>;
        createVideoWidget: (widget: IWidgetVideo) => Promise<void>;
        createTimerWidget: (widget: IWidgetTimer) => void;
        createNewsWidget: (widget: IWidgetNews) => Promise<void>;
        createPbTopWidget: (widget: IWidgetPbTop) => Promise<void>;
        createPbCollectionsWidget: (widget: IWidgetPbCollections) => Promise<void>;
        createSocialWidget: (widget: IWidgetSocial) => Promise<void>;
        createBannerWidget: (widget: IWidgetBanner) => Promise<void>;
        updateContentWidget: (params: IUpdateContentWidgetParams) => void;
        createContentPage: (name: string, serviceId: string, contentPage: IContentPage, widgets: Array<number>) => Promise<void>;
        createProductWidget: (widget: IWidgetProduct) => Promise<void>;
        clearSelectedContentPage: () => void;
        setContentWidget: (params: ISetContentWidgetParams) => void;
        updateContentPage: (name: string, contentPage: IContentPage, widgets: Array<number>) => Promise<void>;
        setContentCollectionWidget: (params: ISetContentCollectionWidgetParams) => void;
        selectNewsWidget: (params: ISelectNewsWidgetParams) => void;
    };
}

interface IState {
    name: string;
    isVisibleSecondaryOverlay: boolean;

    selectedNewsArticle: INewsArticle;
    newsArticleType: 'create' | 'edit';

    selectedWidget: IWidget;
    widgetType: 'create' | 'edit';

    selectedCollectionWidget: IWidgetSingle;
    collectionWidgetType: 'create' | 'edit';

    loaders: {
        createWidget: boolean;
    };
}

type TProps = IProps & IActions & RouteComponentProps<any>;

class ContentPage extends React.PureComponent<TProps, IState> {
    static defaultProps = {
        type: 'create'
    };

    unavalableWidgetTypes: Array<string>;

    constructor(props) {
        super(props);

        this.unavalableWidgetTypes = [
            WIDGET_TYPE_PB_TOP,
            WIDGET_TYPE_PB_COLLECTIONS
        ];

        const { pageContent } = this.props;

        if (pageContent.serviceId === 'pb-ru') {
            this.unavalableWidgetTypes = [];
        }
    }

    overlayNewsArticleRef: React.RefObject<Overlay> = React.createRef();
    overlayCollectionWidgetRef: React.RefObject<Overlay> = React.createRef();
    overlayWidgetRef: React.RefObject<Overlay> = React.createRef();
    gridLayoutRef: React.RefObject<HTMLDivElement> = React.createRef();
    packery: Packery;

    draggyItems: Array<Draggabilly> = [];

    state = {
        isVisibleSecondaryOverlay: false,

        selectedNewsArticle: undefined,
        newsArticleType: this.props.type,

        selectedWidget: undefined as IWidget,
        widgetType: this.props.type,

        selectedCollectionWidget: undefined,
        collectionWidgetType: this.props.type,

        name: this.props.pageContent.name,
        loaders: {
            createWidget: false
        }
    };

    handleWidgetClick: boolean = true;

    onWindowResize = debounce(() => {
        this.packery && this.packery.layout();
    }, 300);

    performLayout = debounce(() => {
        this.packery.reloadItems();
        this.initDraggy();
        this.packery.layout();
    }, 50);

    initPackery() {
        this.packery = new Packery(ReactDOM.findDOMNode(this.gridLayoutRef.current), {
            columnWidth: 35,
            gutter: 15,
            itemSelector: '.grid-item'
        });
    }

    getWidgetsIds() {
        const widgetsIds = [];

        this.packery.items.forEach(item => {
            if (item.element.hasAttribute('data-id')) {
                const widgetId = Number(item.element.getAttribute('data-id'));

                widgetsIds.push(widgetId);
            }
        });

        return widgetsIds;
    }

    initDraggy() {
        this.draggyItems.forEach(draggyItem => {
            this.packery.unbindDraggabillyEvents(draggyItem);
        });

        const draggyItems: Array<Draggabilly> = [];
        this.packery.items.forEach((item) => {
            if (item.element.classList.contains('grid-item-draggie-ignore')) {
                return;
            }

            const draggyItem = this.initDraggabillyItem(item.element);
            draggyItems.push(draggyItem);
        });
        this.draggyItems = draggyItems;
    }

    initDraggabillyItem(node: HTMLDivElement) {
        const draggie = new Draggabilly(node);

        this.packery.bindDraggabillyEvents(draggie);

        draggie.on('dragStart', () => {
            this.handleWidgetClick = false;
        });
        draggie.on('dragEnd', () => {
            setTimeout(() => {
                this.handleWidgetClick = true;
            }, 0);
        });

        return draggie;
    }

    componentDidMount() {
        const { app } = this.props;

        if (app.id) {
            this.props.actions.getContentPages({ serviceId: String(app.id) });
        }

        this.initPackery();
        window.addEventListener('resize', this.onWindowResize, false);
    }

    onAddWidgetClick = () => {
        this.setState({
            selectedWidget: undefined,
            widgetType: 'create'
        });
        this.overlayWidgetRef.current.toggleVisibility(true);
    };

    onNameChange = (name: string) => {
        this.setState({ name });
    };

    onCreatePageClick = () => {
        const { name } = this.state;
        const serviceId = String(this.props.app.id);
        const { pageContent } = this.props;
        const widgetsIds = this.getWidgetsIds();

        this.props.actions.createContentPage(name, serviceId, pageContent, widgetsIds).then(() => {
            this.props.history.push(clientRoutes.content);
        });
    };

    onEditPageClick = () => {
        const { name } = this.state;
        const { pageContent } = this.props;
        const widgetsIds = this.getWidgetsIds();

        this.props.actions.updateContentPage(name, pageContent, widgetsIds).then(() => {
            this.props.history.push(clientRoutes.content);
        });
    };

    onOverlayChange = () => {
        const { selectedWidget } = this.state

        if (selectedWidget && selectedWidget.type === 'collection') {
            this.props.actions.clearSelectedCollectionWidget();
        }

        if (selectedWidget && selectedWidget.type === 'news') {
            this.props.actions.clearSelectedNewsWidget();
        }

        this.setState({
            widgetType: this.props.type,
            selectedWidget: undefined
        });
    };

    onSecondaryOverlayChange = () => {
        this.setState({
            selectedCollectionWidget: undefined,
            selectedNewsArticle: undefined,
            newsArticleType: this.props.type,
            collectionWidgetType: this.props.type,
            isVisibleSecondaryOverlay: false
        });
    };

    onProductWidgetClick = (widget: IWidgetProduct) => {
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    openOverlay = () => {
        this.overlayWidgetRef.current.toggleVisibility(true);
    };

    closeOverlay = () => {
        this.overlayWidgetRef.current.toggleVisibility();
    };

    onBannerWidgetClick = (widget: IWidgetBanner) => {
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    proxyClick = (handler) => (widget) => {
        if (!this.handleWidgetClick) {
            return;
        }

        handler(widget);
    };

    onBannersWidgetClick = (widget: IWidgetCollection) => {
        this.props.actions.selectCollectionWidget({ widget });
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    onPbCollectionClick = (widget: IWidgetPbCollections) => {
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    onVideoClick = (widget: IWidgetVideo) => {
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    onSocialPanelClick = (widget: IWidgetSocial) => {
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    onNewsClick = (widget: IWidgetNews) => {
        this.props.actions.selectNewsWidget({ widget });
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    onPbTopClick = (widget: IWidgetPbTop) => {
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    onTimerClick = (widget: IWidgetTimer) => {
        this.setState({ selectedWidget: widget, widgetType: 'edit' }, this.openOverlay);
    };

    componentWillUnmount() {
        this.props.actions.clearSelectedContentPage();
    }

    onSubmit = (widget: IWidget) => {
        if (this.state.widgetType === 'create') {
            this.createWidget(widget).then(() => {
                this.props.actions.setContentWidget({ widget });
            });
        } else {
            const widgetId = widget.id;

            this.createWidget(widget).then(() => {
                this.props.actions.updateContentWidget({ widgetId, widget });
                this.setState({ selectedWidget: widget });
            });
        }
    };

    onCollectionWidgetSubmit = (widget: IWidgetSingle) => {
        if (this.state.collectionWidgetType === 'create') {
            this.createWidget(widget).then(() => {
                this.props.actions.setContentCollectionWidget({ widget: widget as IWidgetSingle });
            });
        } else {
            const widgetId = widget.id;

            this.createWidget(widget).then(() => {
                this.props.actions.updateContentCollectionWidget({ widgetId, widget });
                this.setState({ selectedCollectionWidget: widget });
            });
        }
    };

    onWidgetRemove = () => {
        const widgetId = this.state.selectedWidget.id;

        this.props.actions.removeWidget({ widgetId });
        this.setState({ selectedWidget: undefined }, this.closeOverlay);
    };

    onWidgetTypeChange = (widgetType: string) => {
        if (widgetType === WIDGET_TYPE_BANNERS) {
            this.setState({
                selectedWidget: this.props.selectedWidgetCollection
            });
        } else if (widgetType === WIDGET_TYPE_NEWS) {
            this.setState({
                selectedWidget: this.props.selectedNewsWidget
            });
        }
    };

    onCollectionWidgetRemove = () => {
        const widgetId = this.state.selectedCollectionWidget.id;

        this.props.actions.removeCollectionWidget({ widgetId });
        this.setState({ selectedCollectionWidget: undefined }, () => {
            this.overlayCollectionWidgetRef.current.toggleVisibility();
        });
    };

    onCollectionWidgetCreate = () => {
        this.overlayCollectionWidgetRef.current.toggleVisibility(true);
        this.setState({
            collectionWidgetType: 'create',
            selectedWidget: this.props.selectedWidgetCollection,
            isVisibleSecondaryOverlay: true
        });
    };

    onCollectionWidgetEdit = (widget: IWidgetSingle) => {
        this.overlayCollectionWidgetRef.current.toggleVisibility(true);
        this.setState({
            selectedCollectionWidget: widget,
            isVisibleSecondaryOverlay: true
        });
    };

    onNewsArticleCreate = () => {
        this.overlayNewsArticleRef.current.toggleVisibility(true);
        this.setState({
            newsArticleType: 'create',
            selectedWidget: this.props.selectedNewsWidget,
            selectedNewsArticle: undefined,
            isVisibleSecondaryOverlay: true
        });
    };

    onNewsArticleEdit = (newsArticle: INewsArticle) => {
        this.overlayNewsArticleRef.current.toggleVisibility(true);
        this.setState({
            newsArticleType: 'edit',
            selectedWidget: this.props.selectedNewsWidget,
            selectedNewsArticle: newsArticle,
            isVisibleSecondaryOverlay: true
        });
    };

    onNewsArticleRemove = () => {
        this.setState({ selectedNewsArticle: undefined }, () => {
            this.overlayNewsArticleRef.current.toggleVisibility();
        });
    };

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.selectedWidgetCollection !== this.props.selectedWidgetCollection) {
            if (this.state.selectedWidget && this.state.selectedWidget.type === 'collection') {
                this.setState({ selectedWidget: nextProps.selectedWidgetCollection });
            }
        }

        if (nextProps.selectedNewsWidget !== this.props.selectedNewsWidget) {
            if (this.state.selectedWidget && this.state.selectedWidget.type === 'news') {
                this.setState({ selectedWidget: nextProps.selectedNewsWidget });
            }
        }
    }

    createWidget(widget: IWidget) {
        let promise;
        widget.serviceId = String(this.props.app.id);

        this.setState({ loaders: { createWidget: true } });

        switch (widget.type) {
            case 'product': promise = this.props.actions.createProductWidget(widget); break;
            case 'banner': promise = this.props.actions.createBannerWidget(widget); break;
            case 'social': promise = this.props.actions.createSocialWidget(widget); break;
            case 'video': promise = this.props.actions.createVideoWidget(widget); break;
            case 'collection': promise = this.props.actions.createCollectionWidget(widget); break;
            case 'news': promise = this.props.actions.createNewsWidget(widget); break;
            case 'pbCollections': promise = this.props.actions.createPbCollectionsWidget(widget); break;
            case 'pbTop': promise = this.props.actions.createPbTopWidget(widget); break;
            case 'timer': promise = this.props.actions.createTimerWidget(widget); break;
        }

        return promise.then(() => {
            this.setState({ loaders: { createWidget: false } });
        }).catch(() => {
            this.setState({ loaders: { createWidget: false } });
            return Promise.reject({});
        });
    }

    componentDidUpdate() {
        this.performLayout();
    }

    render() {
        const { pageContent, loaders, type, area, imagesGroups } = this.props;
        const {
            selectedNewsArticle,
            newsArticleType,
            collectionWidgetType,
            isVisibleSecondaryOverlay,
            name,
            loaders: internalLoaders,
            selectedWidget,
            widgetType,
            selectedCollectionWidget
        } = this.state;
        const { unavalableWidgetTypes } = this;

        return (
            <Container>
                <Inner className="mt-xl ml-xl pb-xl">
                    <Input
                        locator="page-name-input"
                        label="Название страницы"
                        onChange={this.onNameChange}
                        theme="light"
                        className="col-6"
                        placeholder="Введи название"
                        value={name}
                    />
                    <div data-locator="widgets" className="mt-m pb-m" ref={this.gridLayoutRef}>
                        {pageContent.widgets.map(widget => {
                            switch(widget.type) {
                                case 'pbCollections': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s ${widget.id} col-4`}
                                    >
                                        <PbCollections
                                            widget={widget}
                                            onClick={this.proxyClick(this.onPbCollectionClick)}
                                        />
                                    </GridCell>
                                );

                                case 'collection': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s ${widget.id} col-${widget.size.width}`}
                                    >
                                        <Banners
                                            onClick={this.proxyClick(this.onBannersWidgetClick)}
                                            widget={widget}
                                        />
                                    </GridCell>
                                );

                                case 'product': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s col-${widget.size.width}`}
                                    >
                                        <ProductCard
                                            widget={widget}
                                            area={area}
                                            onClick={this.proxyClick(this.onProductWidgetClick)}
                                        />
                                    </GridCell>
                                );

                                case 'banner': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s col-${widget.size.width}`}
                                    >
                                        <Banner
                                            area={area.lang}
                                            onClick={this.proxyClick(this.onBannerWidgetClick)}
                                            widget={widget}
                                        />
                                    </GridCell>
                                );

                                case 'video': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s col-${widget.size.width}`}
                                    >
                                        <Video
                                            area={area.lang}
                                            widget={widget}
                                            onClick={this.proxyClick(this.onVideoClick)}
                                        />
                                    </GridCell>
                                );

                                case 'social': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s col-${widget.size.width}`}
                                    >
                                        <SocialPanel
                                            widget={widget}
                                            onClick={this.proxyClick(this.onSocialPanelClick)}
                                        />
                                    </GridCell>
                                );

                                case 'news': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s col-${widget.size.width}`}
                                    >
                                        <News
                                            onClick={this.proxyClick(this.onNewsClick)}
                                            imagesGroups={imagesGroups}
                                            widget={widget}
                                        />
                                    </GridCell>
                                );

                                case 'pbTop': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s col-${widget.size.width}`}
                                    >
                                        <PbTop
                                            widget={widget}
                                            onClick={this.proxyClick(this.onPbTopClick)}
                                        />
                                    </GridCell>
                                );

                                case 'timer': return (
                                    <GridCell
                                        key={widget.id}
                                        attributes={{ 'data-id': widget.id }}
                                        className={`grid-item mb-s col-${widget.size.width}`}
                                    >
                                        <Timer
                                            area={area}
                                            widget={widget}
                                            onClick={this.proxyClick(this.onTimerClick)}
                                        />
                                    </GridCell>
                                );
                            }
                        })}
                        <div className="grid-item grid-item-draggie-ignore mb-s col-4">
                            <AddWidget onClick={this.onAddWidgetClick} />
                        </div>
                    </div>
                </Inner>
                <Panel>
                    {type === 'create'
                        ? <>
                            <Button
                                locator="publish-page-button"
                                className="col-7"
                                isLoading={loaders.createContentPage}
                                onClick={this.onCreatePageClick}
                            >
                                Опубликовать страницу
                            </Button>
                            <Error className="ml-s" route={api.content.createContentPage} />
                        </>
                        : <>
                            <Button
                                locator="edit-page-button"
                                className="col-7"
                                isLoading={loaders.updateContentPage}
                                onClick={this.onEditPageClick}
                            >
                                Редактировать страницу
                            </Button>
                            <Error className="ml-s" route={api.content.updateContentPage} />
                        </>
                    }
                </Panel>
                <Overlay
                    ref={this.overlayWidgetRef}
                    onChange={this.onOverlayChange}
                >
                    <Constructor
                        unavalableWidgetTypes={unavalableWidgetTypes}
                        onWidgetTypeChange={this.onWidgetTypeChange}
                        widgetTypeDisabled={widgetType === 'edit'}
                        mod={isVisibleSecondaryOverlay ? 'wide' : null}
                        widget={selectedWidget}
                        onWidgetRemove={this.onWidgetRemove}
                        isRemovable={widgetType === 'edit'}
                        isLoading={internalLoaders.createWidget}
                        title={widgetType === 'create' ? 'Создать виджет' : 'Редактировать виджет'}
                        actionTitle={widgetType === 'create' ? 'Создать' : 'Редактировать'}
                        onSubmit={this.onSubmit}
                        onCollectionWidgetCreate={this.onCollectionWidgetCreate}
                        onCollectionWidgetEdit={this.onCollectionWidgetEdit}
                        onNewsArticleCreate={this.onNewsArticleCreate}
                        onNewsArticleEdit={this.onNewsArticleEdit}
                    />
                </Overlay>
                <Overlay
                    mod="secondary"
                    ref={this.overlayCollectionWidgetRef}
                    onChange={this.onSecondaryOverlayChange}
                >
                    <Constructor
                        widgetTypeDisabled={collectionWidgetType === 'edit'}
                        availableWidgetTypes={[WIDGET_TYPE_BANNER]}
                        widget={selectedCollectionWidget}
                        onWidgetRemove={this.onCollectionWidgetRemove}
                        isRemovable={collectionWidgetType === 'edit'}
                        widgetType={WIDGET_TYPE_BANNER}
                        isLoading={internalLoaders.createWidget}
                        title={collectionWidgetType === 'create' ? 'Создать виджет' : 'Редактировать виджет'}
                        actionTitle={collectionWidgetType === 'create' ? 'Создать' : 'Редактировать'}
                        onSubmit={this.onCollectionWidgetSubmit}
                    />
                </Overlay>
                <Overlay
                    onChange={this.onSecondaryOverlayChange}
                    mod="secondary"
                    ref={this.overlayNewsArticleRef}
                >
                    <NewsArticle
                        onRemove={this.onNewsArticleRemove}
                        type={newsArticleType}
                        newsArticle={selectedNewsArticle}
                        widget={selectedWidget as IWidgetNews}
                    />
                </Overlay>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    imagesGroups: state.imagesGroups,
    area: state.area.selected,
    app: state.appsOptions.selected,
    pageContent: state.content.selected,
    selectedWidgetCollection: state.content.selectedWidgetCollection,
    selectedNewsWidget: state.content.selectedNewsWidget
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        removeCollectionWidget,
        createTimerWidget,
        getContentPages,
        createPbTopWidget,
        createNewsWidget,
        removeWidget,
        selectCollectionWidget,
        createCollectionWidget,
        createSocialWidget,
        updateContentWidget,
        createContentPage,
        createProductWidget,
        clearSelectedContentPage,
        clearSelectedNewsWidget,
        setContentWidget,
        updateContentPage,
        createBannerWidget,
        createVideoWidget,
        setContentCollectionWidget,
        clearSelectedCollectionWidget,
        updateContentCollectionWidget,
        selectNewsWidget,
        createPbCollectionsWidget
    }, dispatch)
});

const ContentPageWithConnect = withRouter<TProps>(connect(mapStateToProps, mapDispatchToProps)(ContentPage));

export default (props: TProps) => (
    <RequestTracker loaders={[
        api.content.createContentPage,
        api.content.updateContentPage
    ]}>
        <ContentPageWithConnect {...props} />
    </RequestTracker>
);
