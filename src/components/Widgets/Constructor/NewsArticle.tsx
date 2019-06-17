import React from 'react';
import { Formik } from 'formik';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cloneDeep from 'lodash/cloneDeep';
import moment, { Moment } from 'moment';
import * as yup from 'yup';
import omit from 'lodash/omit';

import Button from 'ui/lib/Button';
import Input from 'ui/lib/Input';
import Icon from 'ui/lib/Icon';

import { SimpleError, Form, Row, Field } from 'src/components/Form/Form';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import UploadImage from './UploadImage';
import Image from 'src/components/Image/Image';
import { IStore } from 'src/store';
import { IApp } from 'src/components/Apps/Apps';
import Calendar from 'src/components/Calendar/Calendar';

import { removeNewsWidgetItem, IRemoveNewsWidgetItemParams } from 'src/entities/Content/actions';
import { deleteNews, IDeleteNewsRequestParams } from 'src/entities/News/actions';
import { createNewsFeed, ICreateNewsFeedRequestParams, ICreateNewsFeedResult } from 'src/entities/NewsFeeds/actions';
import { createNews, ICreateNewsRequestParams, ICreateNewsResult } from 'src/entities/News/actions';
import { updateNewsWidgetSource, IUpdateNewsWidgetSourceParams } from 'src/entities/Content/actions';
import { setNewsWidgetItem, ISetNewsWidgetItemParams } from 'src/entities/Content/actions';
import { editNews, IEditNewsRequestParams } from 'src/entities/News/actions';
import { updateNewsWidgetItem, IUpdateNewsWidgetItemParams } from 'src/entities/Content/actions';

import { INewsArticle, IWidgetNews } from 'src/entities/Content/store';

import api from 'src/routes/api';
import Select from 'ui/lib/Select';

const sourceOptions = [
    'twitter',
    'youtube',
    'facebook',
    'vkontakte',
    'forum',
    'twitch',
    'instagram',
    'discord',
    'odnoklassniki'
].map(source => ({
    id: source,
    value: source
}));

interface IProps {
    app: IApp;
    loaders?: {
        createNewsFeed: boolean;
        deleteNews: boolean;
        createNews: boolean;
        editNews: boolean;
    };
}

interface IOwnProps {
    type: string;
    newsArticle?: INewsArticle;
    widget: IWidgetNews
    onRemove: () => void;
}

interface IActions {
    actions: {
        removeNewsWidgetItem: (params: IRemoveNewsWidgetItemParams) => void;
        createNewsFeed: (params: ICreateNewsFeedRequestParams) => Promise<ICreateNewsFeedResult>;
        createNews: (params: ICreateNewsRequestParams) => Promise<ICreateNewsResult>;
        updateNewsWidgetSource: (params: IUpdateNewsWidgetSourceParams) => void;
        setNewsWidgetItem: (params: ISetNewsWidgetItemParams) => void;
        deleteNews: (params: IDeleteNewsRequestParams) => void;
        editNews: (params: IEditNewsRequestParams) => void;
        updateNewsWidgetItem: (params: IUpdateNewsWidgetItemParams) => void;
    };
}

type TProps = IProps & IOwnProps & IActions;

interface IState extends INewsArticle {
    whenPublishedTime: string;
}

interface IFormikNewsArticleValues extends IState {}

class FormikNewsArticle extends Formik<{}, IFormikNewsArticleValues> {}

import overlayCSS from 'src/components/Overlay/Overlay.css';

const setTime = (date: string, time: string) => {
    const [ hours, minutes ] = time.split(':');

    return moment(date)
        .set('hours', Number(hours))
        .set('minutes', Number(minutes))
        .format();
};

export class NewsArticle extends React.PureComponent<TProps, IState> {
    formikNewsArticleRef: React.RefObject<FormikNewsArticle> = React.createRef();
    whenPublishedTime: string = '';

    constructor(props: TProps) {
        super(props);

        const { newsArticle } = this.props;

        const state = cloneDeep(newsArticle || {
            imageId: '',
            title: '',
            lead: '',
            whenPublished: moment().format(),
            sourceData: {
                source: '',
                url: ''
            }
        }) as IState;

        state.whenPublishedTime = moment(newsArticle && newsArticle.whenPublished || state.whenPublished).format('HH:mm');
        this.state = state;
    }

    onNewsArticleCreate = async (values: IFormikNewsArticleValues) => {
        values.whenPublished = setTime(values.whenPublished, values.whenPublishedTime);

        const { widget } = this.props;
        const newsArticle: INewsArticle = omit(values, ['whenPublishedTime']);
        let feedId = widget.source.newsFeedId;

        if (!widget.source.newsFeedId) {
            const { id: newsFeedId } = await this.props.actions.createNewsFeed({
                value: {
                    serviceId: this.props.app.id,
                    name: '',
                    description: ''
                }
            });

            feedId = newsFeedId;
            this.props.actions.updateNewsWidgetSource({ source: { newsFeedId }});
        }

        const news: INewsArticle = { feedId, ...newsArticle };
        const { id: newsId } = await this.props.actions.createNews({ value: { feedId, ...newsArticle } });

        news.id = newsId;
        this.props.actions.setNewsWidgetItem({ news });
    };

    onNewsArticleEdit = async (values: IFormikNewsArticleValues) => {
        values.whenPublished = setTime(values.whenPublished, values.whenPublishedTime);

        const newsArticle: INewsArticle = omit(values, ['whenPublishedTime']);
        await this.props.actions.editNews({ value: { ...newsArticle } });
        this.props.actions.updateNewsWidgetItem({ news: { ...newsArticle } });
    };

    onNewsArticleDelete = async () => {
        await this.props.actions.deleteNews({ id: this.props.newsArticle.id });
        this.props.actions.removeNewsWidgetItem({ news: this.props.newsArticle });
        this.props.onRemove();
    };

    onUploadImage = ({ imageId }: { imageId: string; }) => {
        const formik = this.formikNewsArticleRef.current;

        formik.setFieldValue('imageId', imageId);
        formik.setFieldTouched('imageId', true);
    };

    proxyBlur = (value: string, event: React.FormEvent<HTMLInputElement>) => {
        this.formikNewsArticleRef.current.handleBlur(event);
    };

    render() {
        const { state } = this;
        const { type, loaders } = this.props;
        const actionTitle = type === 'create'
            ? 'Создать'
            : 'Редактировать';
        const title = type === 'create'
            ? 'Создать новость'
            : 'Редактировать новость';

        return (
            <FormikNewsArticle
                ref={this.formikNewsArticleRef}
                initialValues={{ ...state }}
                onSubmit={type === 'create'
                    ? this.onNewsArticleCreate
                    : this.onNewsArticleEdit
                }
                validationSchema={yup.object().shape({
                    whenPublished: yup.string().required('Укажи дату публикации'),
                    whenPublishedTime: yup.string().test('timeTest', function(value: string) {
                        const { path, createError } = this;

                        return moment(value, 'HH:mm', true).isValid() || createError({ path, message: 'Укажи время в формате ХХ:ХХ' });
                    }),
                    imageId: yup.string().required('Необходимо загрузить картинку'),
                    title: yup.string().required('Укажи заголовок')
                })}
                render={({ handleSubmit, values, setFieldValue, errors, touched, setFieldTouched }) => (
                    <Form locator="add-article-form" className={classNames(
                        overlayCSS.container,
                        'pl-l',
                        'pt-xl'
                    )}>
                        <div className="font-size-large mb-m">{title}</div>
                        <div className="col-6">
                            {values.imageId && (
                                <Row>
                                    <Image
                                        width={125}
                                        height={80}
                                        imageType="desktop"
                                        imageGroup="news"
                                        imageId={values.imageId}
                                    />
                                </Row>
                            )}
                            <Row>
                                <UploadImage
                                    imageGroup="news"
                                    onUploadImage={this.onUploadImage}
                                />
                            </Row>
                            {touched.imageId && errors.imageId && (
                                <SimpleError className="text-align-left mt-s">
                                    {errors.imageId}
                                </SimpleError>
                            )}
                            <Row>
                                <Field className="mr-s">
                                    <Calendar
                                        date={values.whenPublished}
                                        placeholder="Укажите дату публикации"
                                        onChange={(date: Moment) => {
                                            setFieldValue('whenPublished', date && date.format() || '');
                                            setFieldTouched('whenPublished', true);
                                        }}
                                        showClearDate
                                    />
                                </Field>
                                <Field>
                                    <Input
                                        locator="time-input"
                                        theme="light"
                                        placeholder="Время, н-р 10:20"
                                        value={values.whenPublishedTime}
                                        onBlur={(time: string) => {
                                            setFieldValue('whenPublishedTime', time);
                                            setFieldTouched('whenPublishedTime', true);
                                        }}
                                    />
                                </Field>
                            </Row>
                            {touched.whenPublished && errors.whenPublished && (
                                <SimpleError className="text-align-left mt-s">
                                    {errors.whenPublished}
                                </SimpleError>
                            )}
                            {touched.whenPublishedTime && errors.whenPublishedTime && (
                                <SimpleError className="text-align-left mt-s">
                                    {errors.whenPublishedTime}
                                </SimpleError>
                            )}
                            <Row>
                                <Field>
                                    <Input
                                        locator="article-title-input"
                                        name="title"
                                        status={touched.title && errors.title ? 'error' : null}
                                        hint={touched.title && errors.title && String(errors.title)}
                                        theme="light"
                                        label="Заголовок"
                                        value={values.title}
                                        placeholder="Укажи заголовок"
                                        onBlur={this.proxyBlur}
                                        onChange={(title: string) => {
                                            setFieldValue('title', title);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="lid-input"
                                        theme="light"
                                        label="Лид"
                                        value={values.lead}
                                        placeholder="Укажи лид"
                                        onChange={(lead: string) => {
                                            setFieldValue('lead', lead);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="link-input"
                                        theme="light"
                                        label="Ссылка"
                                        value={values.sourceData.url}
                                        placeholder="Укажи ссылку"
                                        onChange={(url: string) => {
                                            setFieldValue('sourceData.url', url);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Select
                                        locator="source"
                                        position="top"
                                        theme="light"
                                        title="Источник"
                                        placeholder="Укажи источник"
                                        options={sourceOptions}
                                        value={values.sourceData.source || null}
                                        onChange={(source: string) => {
                                            setFieldValue('sourceData.source', source);
                                        }}
                                    />
                                </Field>
                            </Row>
                        </div>
                        <div className={`${overlayCSS.panel} justify-content-space-between`}>
                            <Button
                                locator="add-article-button"
                                isLoading={loaders.createNewsFeed || loaders.createNews || loaders.editNews}
                                type="submit"
                                onClick={handleSubmit}
                                className="col-6 flex-shrink-none"
                            >
                                {actionTitle}
                            </Button>
                            <div className={overlayCSS.errorContainer}>
                                <RequestStatus
                                    errorConfig={{
                                        showDetails: true,
                                        className: overlayCSS.error
                                    }}
                                    className="ml-s"
                                    render={() => null}
                                    routes={[
                                        api.newsFeeds.createNewsFeed,
                                        api.news.createNews,
                                        api.news.deleteNews
                                    ]}
                                />
                            </div>
                            {type === 'edit' && (
                                <Button
                                    isLoading={loaders.deleteNews}
                                    onClick={this.onNewsArticleDelete}
                                    className="remove-button"
                                    theme="thin-black"
                                >
                                    <Icon
                                        className="remove-button-icon"
                                        name="cross"
                                    />
                                </Button>
                            )}
                        </div>
                    </Form>
                )}
            />
        )
    }
}

const mapStateToProps = (state: IStore) => ({
    app: state.appsOptions.selected
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        createNewsFeed,
        createNews,
        updateNewsWidgetSource,
        setNewsWidgetItem,
        deleteNews,
        removeNewsWidgetItem,
        editNews,
        updateNewsWidgetItem
    }, dispatch)
});

const NewsArticleWithConnect = connect(mapStateToProps, mapDispatchToProps)(NewsArticle);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.newsFeeds.createNewsFeed,
        api.news.createNews,
        api.news.deleteNews,
        api.news.editNews
    ]}>
        <NewsArticleWithConnect {...props} />
    </RequestTracker>
);
