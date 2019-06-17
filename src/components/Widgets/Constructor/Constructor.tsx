import React from 'react';
import classNames from 'classnames';

import Icon from 'ui/lib/Icon';
import Select, { IOption } from 'ui/lib/Select';
import Button from 'ui/lib/Button';

import { Form, Row, Field, Inline } from 'src/components/Form/Form';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import {
    IWidget,
    IWidgetSingle,
    IWidgetPbCollections,
    IWidgetProduct,
    IWidgetBanner,
    IWidgetSocial,
    IWidgetVideo,
    IWidgetCollection,
    IWidgetNews,
    INewsArticle,
    IWidgetPbTop,
    IWidgetTimer
} from 'src/entities/Content/store';

import PbCollections, { PbCollections as PbCollectionsComponent } from './PbCollections';
import BannerComponent, { Banner } from './Banner';
import Product from './Product';
import Banners from './Banners';
import SocialPanel from './SocialPanel';
import VideoComponent, { Video } from './Video';
import NewsComponent, { News } from './News';
import PbTop from './PbTop';
import Timer, { Timer as TimerComponent } from './Timer';

import css from 'src/components/Overlay/Overlay.css';

export const WIDGET_TYPE_PRODUCT = 'product';
export const WIDGET_TYPE_BANNER = 'banner';
export const WIDGET_TYPE_SOCIAL = 'social';
export const WIDGET_TYPE_BANNERS = 'collection';
export const WIDGET_TYPE_VIDEO = 'video';
export const WIDGET_TYPE_NEWS = 'news';
export const WIDGET_TYPE_PB_COLLECTIONS = 'pbCollections';
export const WIDGET_TYPE_PB_TOP = 'pbTop';
export const WIDGET_TYPE_TIMER = 'timer';

const WIDGET_SIZE_SMALL = 4;
const WIDGET_SIZE_MEDIUM = 8;
const WIDGET_SIZE_BIG = 12;

const widgetTypes = [
    { id: WIDGET_TYPE_PRODUCT, value: 'Товар' },
    { id: WIDGET_TYPE_BANNER, value: 'Баннер' },
    { id: WIDGET_TYPE_SOCIAL, value: 'Социалки' },
    { id: WIDGET_TYPE_BANNERS, value: 'Карусель банеров' },
    { id: WIDGET_TYPE_VIDEO, value: 'Видео' },
    { id: WIDGET_TYPE_NEWS, value: 'Новости' },
    { id: WIDGET_TYPE_PB_COLLECTIONS, value: 'Коллекции ПБ' },
    { id: WIDGET_TYPE_PB_TOP, value: 'Топ ПБ' },
    { id: WIDGET_TYPE_TIMER, value: 'Таймер' }
];

const widgetSizes = [
    { id: WIDGET_SIZE_SMALL, value: 'Маленький' },
    { id: WIDGET_SIZE_MEDIUM, value: 'Средний' },
    { id: WIDGET_SIZE_BIG, value: 'Большой' }
];

const widgetSizesByType = {
    [WIDGET_TYPE_NEWS]: [ WIDGET_SIZE_BIG ],
    [WIDGET_TYPE_PB_TOP]: [ WIDGET_SIZE_SMALL ],
    [WIDGET_TYPE_TIMER]: [ WIDGET_SIZE_SMALL ]
};

interface IState {
    widgetType: null | string;
    widgetSize: null | number;
    widgetTypes: IWidgetTypes;
    widgetSizes: IWidgetSizes;
}

type IWidgetTypes = Array<{
    id: string;
    value: string;
}>;

type IWidgetSizes = Array<{
    id: number;
    value: string;
}>;

interface IProps {
    onWidgetTypeChange?: (widgetType: string) => void;
    unavalableWidgetTypes?: Array<string>;
    availableWidgetTypes?: Array<string>;
    widgetTypeDisabled?: boolean;
    isRemovable?: boolean;
    mod?: string;
    widgetType?: string | null;
    actionTitle: string;
    widget?: IWidget;
    title: string;
    isLoading: boolean;
    onSubmit: (widget: IWidget) => void;
    onCollectionWidgetCreate?: () => void;
    onCollectionWidgetEdit?: (widget: IWidgetSingle) => void;
    onNewsArticleCreate?: () => void;
    onNewsArticleEdit?: (newsArticle: INewsArticle) => void;
    onWidgetRemove: () => void;
}

import api from 'src/routes/api';

export default class Contructor extends React.PureComponent<IProps, IState> {
    static defaultProps = {
        widgetTypeDisabled: false,
        unavalableWidgetTypes: []
    };

    pbCollectionsRef: React.RefObject<{ getWrappedInstance: () => PbCollectionsComponent; }> = React.createRef();
    productFormRef: React.RefObject<Product> = React.createRef();
    bannersFormRef: React.RefObject<Banners> = React.createRef();
    bannerFormRef: React.RefObject<{ getWrappedInstance: () => Banner; }> = React.createRef();
    socialFormRef: React.RefObject<SocialPanel> = React.createRef();
    videoFormRef: React.RefObject<{ getWrappedInstance: () => Video; }> = React.createRef();
    newsFormRef: React.RefObject<{ getWrappedInstance: () => News; }> = React.createRef();
    pbTopRef: React.RefObject<PbTop> = React.createRef();
    timerRef: React.RefObject<{ getWrappedInstance: () => TimerComponent; }> = React.createRef();

    constructor(props: IProps) {
        super(props);

        let { widgetType } = props;
        const { widget, availableWidgetTypes, unavalableWidgetTypes } = props;

        widgetType = widgetType || widget && widget.type || undefined;

        let currentWidgetTypes = availableWidgetTypes
            ? widgetTypes.filter((type) => availableWidgetTypes.includes(type.id))
            : widgetTypes

        currentWidgetTypes = currentWidgetTypes.filter(type => !unavalableWidgetTypes.includes(type.id));

        const state = {
            widgetSizes: widgetSizes,
            widgetType: widgetType,
            widgetSize: undefined,
            widgetTypes: currentWidgetTypes
        };

        if (widgetType) {
            if (widgetSizesByType[widgetType]) {
                state.widgetSizes = widgetSizes
                    .filter(size => widgetSizesByType[widgetType].includes(size.id));
            }

            if (widget) {
                state.widgetSize = widget.size.width;
                state.widgetType = widget.type;
            }
        }

        this.state = state;
    }

    onWidgetTypeChange = (value: string, option: IOption) => {
        const widgetType = String(option.id);
        let availableWidgetSizes = widgetSizes;
        let { widgetSize } = this.state;

        if (widgetSizesByType[widgetType]) {
            availableWidgetSizes = widgetSizes
                .filter(size => widgetSizesByType[widgetType].includes(size.id));

            widgetSize = availableWidgetSizes[0].id;
        }

        this.setState({
            widgetSizes: availableWidgetSizes,
            widgetType,
            widgetSize
        });

        this.props.onWidgetTypeChange && this.props.onWidgetTypeChange(widgetType);
    };

    onWidgetSizeChange = (value: string, option: IOption) => {
        this.setState({ widgetSize: Number(option.id) });
    };

    onSubmit = () => {
        const { widgetType, widgetSize } = this.state;
        let widget: IWidget;
        let promise: Promise<any> = Promise.resolve();

        switch(widgetType) {
            case WIDGET_TYPE_PB_COLLECTIONS: {
                widget = this.pbCollectionsRef.current.getWrappedInstance().getWidgetConfig();
            } break;

            case WIDGET_TYPE_PRODUCT: {
                widget = this.productFormRef.current.getWidgetConfig();
            } break;

            case WIDGET_TYPE_BANNERS: {
                widget = this.bannersFormRef.current.getWidgetConfig();
            } break;

            case WIDGET_TYPE_BANNER: {
                widget = this.bannerFormRef.current.getWrappedInstance().getWidgetConfig();
            } break;

            case WIDGET_TYPE_SOCIAL: {
                widget = this.socialFormRef.current.getWidgetConfig();
            } break;

            case WIDGET_TYPE_VIDEO: {
                widget = this.videoFormRef.current.getWrappedInstance().getWidgetConfig();
            } break;

            case WIDGET_TYPE_NEWS: {
                promise = this.newsFormRef.current.getWrappedInstance().validate();
                widget = this.newsFormRef.current.getWrappedInstance().getWidgetConfig();
            } break;

            case WIDGET_TYPE_PB_TOP: {
                widget = this.pbTopRef.current.getWidgetConfig();
            } break;

            case WIDGET_TYPE_TIMER: {
                promise = this.timerRef.current.getWrappedInstance().validate();
                widget = this.timerRef.current.getWrappedInstance().getWidgetConfig();
            } break;
        }

        widget.size = { width: widgetSize };

        promise.then((errors = {}) => {
            if (!Object.keys(errors).length) {
                this.props.onSubmit(widget);
            }
        });
    };

    render() {
        const {
            title,
            isLoading,
            widget,
            actionTitle,
            mod,
            isRemovable,
            widgetTypeDisabled
        } = this.props;

        const { widgetSizes, widgetType, widgetTypes, widgetSize } = this.state;
        let form = null;

        switch(widgetType) {
            case WIDGET_TYPE_PRODUCT: {
                form = <Product
                    widget={widget as IWidgetProduct}
                    ref={this.productFormRef}
                />;
            } break;

            case WIDGET_TYPE_PB_COLLECTIONS: {
                form = <PbCollections
                    widget={widget as IWidgetPbCollections}
                    ref={this.pbCollectionsRef}
                />;
            } break;

            case WIDGET_TYPE_BANNERS: {
                form = <Banners
                    onBannerCreate={this.props.onCollectionWidgetCreate}
                    onBannerEdit={this.props.onCollectionWidgetEdit}
                    widget={widget as IWidgetCollection}
                    ref={this.bannersFormRef}
                />;
            } break;

            case WIDGET_TYPE_BANNER: {
                form = <BannerComponent
                    widget={widget as IWidgetBanner}
                    ref={this.bannerFormRef}
                />;
            } break;

            case WIDGET_TYPE_SOCIAL: {
                form = <SocialPanel
                    widget={widget as IWidgetSocial}
                    ref={this.socialFormRef}
                />;
            } break;

            case WIDGET_TYPE_VIDEO: {
                form = <VideoComponent
                    widget={widget as IWidgetVideo}
                    ref={this.videoFormRef}
                />;
            } break;

            case WIDGET_TYPE_NEWS: {
                form = <NewsComponent
                    ref={this.newsFormRef}
                    widget={widget as IWidgetNews}
                    onNewsArticleCreate={this.props.onNewsArticleCreate}
                    onNewsArticleEdit={this.props.onNewsArticleEdit}
                />;
            } break;

            case WIDGET_TYPE_PB_TOP: {
                form = <PbTop
                    ref={this.pbTopRef}
                    widget={widget as IWidgetPbTop}
                />;
            } break;

            case WIDGET_TYPE_TIMER: {
                form = <Timer
                    ref={this.timerRef}
                    widget={widget as IWidgetTimer}
                />;
            }
        }

        return (
            <div className={classNames(css.container, 'pl-l', 'pt-xl', css[mod])}>
                <div className="font-size-large">{title}</div>
                <Form className="mt-m">
                    <Inline className="col-13 justify-content-space-between">
                        <div className="col-6">
                            <Row>
                                <Field>
                                    <Select
                                        locator="widget-type"
                                        disabled={widgetTypeDisabled}
                                        title="Тип виджета"
                                        placeholder="Выберите тип"
                                        theme="light"
                                        options={widgetTypes}
                                        onChange={this.onWidgetTypeChange}
                                        value={widgetType}
                                    />
                                </Field>
                            </Row>
                        </div>
                        <div className="col-6">
                            <Row>
                                <Field>
                                    <Select
                                        locator="widget-size"
                                        title="Размер виджета"
                                        placeholder="Выберите размер"
                                        theme="light"
                                        options={widgetSizes}
                                        onChange={this.onWidgetSizeChange}
                                        value={widgetSize}
                                    />
                                </Field>
                            </Row>
                        </div>
                    </Inline>
                    <Inline className="mt-l col-13 justify-content-space-between">
                        {form}
                    </Inline>
                    <div className={css.panel}>
                        <Button
                            locator="create-widget-button"
                            isLoading={isLoading}
                            className="col-6 flex-shrink-fixed"
                            onClick={this.onSubmit}
                        >
                            {actionTitle}
                        </Button>
                        <div className={css.errorContainer}>
                            <RequestStatus
                                errorConfig={{
                                    showDetails: true,
                                    className: css.error
                                }}
                                className="ml-s"
                                render={(request, route) => {
                                    if (route === api.content.createWidget) {
                                        return 'Виджет успешно создан';
                                    }
                                }}
                                routes={[
                                    api.content.createWidget,
                                    api.newsFeeds.createNewsFeed
                                ]}
                            />
                        </div>
                        {isRemovable && (
                            <Button
                                locator="remove-button"
                                onClick={this.props.onWidgetRemove}
                                className="remove-button"
                                theme="thin-black"
                            >
                                <Icon name="cross" />
                            </Button>
                        )}
                    </div>
                </Form>
            </div>
        );
    }
}
