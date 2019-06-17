import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import classNames from 'classnames';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import Checkbox from 'ui/lib/Checkbox';
import Icon from 'ui/lib/Icon';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { createWebshopCategory, ICreateWebshopCategoryRequestParams } from 'src/entities/WebshopCategories/actions';
import { editWebshopCategory, IEditWebshopCategoryRequestParams } from 'src/entities/WebshopCategories/actions';
import { getWebshopCategories, IGetWebshopCategoriesRequestParams } from 'src/entities/WebshopCategories/actions';
import { deleteWebshopCategory, IDeleteWebshopCategoryRequestParams } from 'src/entities/WebshopCategories/actions';
import { Form, Row, Field } from 'src/components/Form/Form';
import api from 'src/routes/api';
import { IWebshopCategory } from 'src/entities/WebshopCategories/models/WebshopCategory';

interface IFormikWebshopCategoryManagerValues {
    slug: string;
    nameRU: string;
    nameEN: string;
    namePT: string;
    isHidden: boolean;
}

class FormikWebshopCategoryManager extends Formik<{}, IFormikWebshopCategoryManagerValues> {}

export interface IProps {
    onClose: () => void;
    serviceId: string;
    type: string;
    category?: IWebshopCategory;
    loaders?: {
        createWebshopCategory: boolean;
        editWebshopCategory: boolean;
        deleteWebshopCategory: boolean;
    };
}

export interface IActions {
    actions: {
        createWebshopCategory: (params: ICreateWebshopCategoryRequestParams) => Promise<void>;
        editWebshopCategory: (params: IEditWebshopCategoryRequestParams) => Promise<void>;
        getWebshopCategories: (params: IGetWebshopCategoriesRequestParams) => void;
        deleteWebshopCategory: (params: IDeleteWebshopCategoryRequestParams) => Promise<void>;
    };
}

import css from 'src/components/Overlay/Overlay.css';

class WebshopCategoryManager extends React.PureComponent<IProps & IActions, any> {
    static defaultProps = {
        type: 'create'
    };

    onSubmit = async (values: IFormikWebshopCategoryManagerValues) => {
        const { type, category, serviceId } = this.props;

        if (type === 'create') {
            await this.props.actions.createWebshopCategory({
                value: {
                    serviceId,
                    slug: values.slug,
                    name: {
                        ru: values.nameRU,
                        en: values.nameEN,
                        pt: values.namePT
                    },
                    isHidden: values.isHidden
                }
            });
            this.props.actions.getWebshopCategories({ serviceId });
        } else {
            await this.props.actions.editWebshopCategory({
                value: {
                    id: category.id,
                    serviceId: category.serviceId,
                    parentCategoryId: category.parentCategoryId,
                    slug: values.slug,
                    name: {
                        ru: values.nameRU,
                        en: values.nameEN,
                        pt: values.namePT
                    },
                    isHidden: values.isHidden
                }
            });
            this.props.actions.getWebshopCategories({ serviceId: category.serviceId });
        }
    };

    onDeleteWebshopCategoryClick = async () => {
        const { id: categoryId, serviceId } = this.props.category;

        await this.props.actions.deleteWebshopCategory({ id: String(categoryId) });
        this.props.onClose();
        this.props.actions.getWebshopCategories({ serviceId });
    };

    render() {
        const { category, type, loaders } = this.props;
        const actionTitle = type === 'create'
            ? 'Создать'
            : 'Редактировать';

        return (
            <FormikWebshopCategoryManager
                initialValues={{
                    slug: category && category.slug,
                    isHidden: category && category.isHidden || false,
                    nameRU: category && category.name.ru,
                    nameEN: category && category.name.en,
                    namePT: category && category.name.pt
                }}
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, handleSubmit }) => (
                    <Form className={classNames(
                        css.container,
                        'pl-l',
                        'pt-xl'
                    )}>
                        <div className="col-6">
                            <Row>
                                <Checkbox
                                    locator="category-hidden-flag"
                                    checked={values.isHidden}
                                    theme="light"
                                    label="Скрыта"
                                    onClick={(isHidden: boolean) => {
                                        setFieldValue('isHidden', isHidden);
                                    }}
                                />
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="category-slug"
                                        label="slug"
                                        placeholder="Укажите slug"
                                        theme="light"
                                        value={values.slug}
                                        onChange={(slug: string) => {
                                            setFieldValue('slug', slug);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="category-name-ru"
                                        label="Название категории: ru"
                                        placeholder="Укажите название для ru региона"
                                        theme="light"
                                        value={values.nameRU}
                                        onChange={(nameRU: string) => {
                                            setFieldValue('nameRU', nameRU);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="category-name-en"
                                        label="Название категории: en"
                                        placeholder="Укажите название для en региона"
                                        theme="light"
                                        value={values.nameEN}
                                        onChange={(nameEN: string) => {
                                            setFieldValue('nameEN', nameEN);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="category-name-pt"
                                        label="Название категории: pt"
                                        placeholder="Укажите название для pt региона"
                                        theme="light"
                                        value={values.namePT}
                                        onChange={(namePT: string) => {
                                            setFieldValue('namePT', namePT);
                                        }}
                                    />
                                </Field>
                            </Row>
                        </div>
                        <div className={`${css.panel} justify-content-space-between`}>
                            <Button
                                locator="category-add-edit-button"
                                type="submit"
                                isLoading={
                                    loaders.editWebshopCategory ||
                                    loaders.createWebshopCategory
                                }
                                onClick={handleSubmit}
                                className="col-6 flex-shrink-none"
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
                                        if (route === api.webshopCategories.editWebshopCategory) {
                                            return 'Категория успешно отредактирована';
                                        } else if (route === api.webshopCategories.createWebshopCategory) {
                                            return 'Категория успешно создана'
                                        }
                                    }}
                                    routes={[
                                        api.webshopCategories.editWebshopCategory,
                                        api.webshopCategories.createWebshopCategory,
                                        api.webshopCategories.deleteWebshopCategory
                                    ]}
                                />
                            </div>
                            {type === 'edit' && (
                                <Button
                                    locator="category-remove-button"
                                    isLoading={loaders.deleteWebshopCategory}
                                    onClick={this.onDeleteWebshopCategoryClick}
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
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        editWebshopCategory,
        getWebshopCategories,
        createWebshopCategory,
        deleteWebshopCategory
    }, dispatch)
});

const WebshopCategoryManagerWithConnect = connect(null, mapDispatchToProps)(WebshopCategoryManager);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.webshopCategories.editWebshopCategory,
        api.webshopCategories.createWebshopCategory,
        api.webshopCategories.deleteWebshopCategory
    ]}>
        <WebshopCategoryManagerWithConnect {...props} />
    </RequestTracker>
);
