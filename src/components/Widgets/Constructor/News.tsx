import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { NewsItem } from 'ui/lib/News/News';

import { IWidgetNews, INewsArticle } from 'src/entities/Content/store';
import { IStore } from 'src/store';
import { IImagesGroups } from 'src/entities/ImagesGroups/store';
import { SimpleError } from 'src/components/Form/Form';
import { updateNewsWidgetSource, IUpdateNewsWidgetSourceParams } from 'src/entities/Content/actions';

import Icon from 'ui/lib/Icon';

interface IProps {
    imagesGroups: IImagesGroups;
    onNewsArticleCreate: () => void;
    onNewsArticleEdit?: (widget: INewsArticle) => void;
    widget: IWidgetNews;
}

interface IActions {
    actions: {
        updateNewsWidgetSource: (params: IUpdateNewsWidgetSourceParams) => void;
    };
}

type TProps = IProps & IActions;

import css from './News.css';
import newsCSS from 'ui/lib/News/News.css';

interface FormikNewsValues {
    newsCount: number;
}

class FormikNews extends Formik<{}, FormikNewsValues> {}

export class News extends React.PureComponent<TProps, any> {
    formikNewsRef: React.RefObject<FormikNews> = React.createRef();

    getWidgetConfig = (): IWidgetNews => this.props.widget;

    validate() {
        return this.formikNewsRef.current.runValidations();
    }

    onControlClick = () => {
        this.props.onNewsArticleCreate();
    };

    onNewsArticleClick = (newsArticle: INewsArticle) => {
        this.props.onNewsArticleEdit && this.props.onNewsArticleEdit(newsArticle);
    };

    renderNews() {
        const { widget, imagesGroups } = this.props;
        const news = widget && widget.news;
        const hasNewsArticles = news && news.length > 0;
        const imagesGroup = imagesGroups.news.desktop;

        if (hasNewsArticles) {
            return (
                news.map(newsArticle => (
                    <div
                        className={classNames('mt-s', 'col-12', css.news)}
                        onClick={() => this.onNewsArticleClick(newsArticle)}
                    >
                        <div className={newsCSS.container}>
                            <NewsItem
                                title={newsArticle.title}
                                lead={newsArticle.lead}
                                preview={imagesGroup.replace('{id}', newsArticle.imageId)}
                                date={newsArticle.whenPublished}
                                sourceData={newsArticle.sourceData as any}
                            />
                        </div>
                    </div>
                ))
            );
        }
    }

    render() {
        const { widget } = this.props;

        return (
            <FormikNews
                ref={this.formikNewsRef}
                enableReinitialize
                onSubmit={() => {}}
                validationSchema={yup.object().shape({
                    newsCount: yup.number().min(1, 'Необходимо создать хотя бы одну новость')
                })}
                initialValues={{
                    newsCount: widget ? widget.news.length : 0
                }}
                render={({ errors }) => (
                    <div className="col-6">
                        {errors.newsCount && (
                            <SimpleError className="text-align-left mb-s">{errors.newsCount}</SimpleError>
                        )}
                        <div
                            className={classNames(css.add, 'col-12')}
                            onClick={this.onControlClick}
                        >
                            <Icon
                                className={css.plus}
                                category="controls"
                                name="plus"
                            />
                        </div>
                        {this.renderNews()}
                    </div>
                )}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    imagesGroups: state.imagesGroups
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        updateNewsWidgetSource
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(News);
