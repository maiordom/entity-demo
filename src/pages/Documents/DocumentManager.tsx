import React from 'react';
import classNames from 'classnames';
import { Formik } from 'formik';
import * as yup from 'yup';

import { IAddDocumentRequestParams, ISaveDocumentRequestParams } from 'src/entities/Documents/actions';
import { IVersionDetails } from 'src/entities/Documents/models/VersionDetails';

import Input from 'ui/lib/Input';
import Select, { IOption } from 'ui/lib/Select';
import Button from 'ui/lib/Button';

import { Row, Field, Inline, SimpleError } from 'src/components/Form/Form';
import { IDocument } from 'src/entities/Documents/models/Document';
import Apps from 'src/components/Apps/Apps';

import css from './VersionManager.css';

export interface IProps {
    localeKey: string;
    contentType: string;
    selectedServiceId?: string;
    document?: IDocument;
    documentTypeOptions: Array<IOption>;
    onSave: (document: IAddDocumentRequestParams | ISaveDocumentRequestParams) => void;
}

export interface IState {
    type: string | number;
}

interface IFormikValues {
    name: any;
    type: string | number;
    tag?: string;
    serviceId: string;
}

class FormikVersionDetails extends Formik<{}, IFormikValues> {}

class Document extends React.Component<IProps, IState> {
    private formRef: React.RefObject<FormikVersionDetails> = React.createRef();

    private defaultDocument;

    private juristicTagOptions = [
        { value: 'Нет тега', id: '' },
        { value: 'Лицензия', id: 'license' },
        { value: 'Пользовательское соглашение', id: 'terms' },
        { value: 'Компоненты', id: 'components' },
        { value: 'Политика конфиденциальности', id: 'privacy' },
        { value: 'Порядок расчётов', id: 'procedure' }
    ];

    private webshopAfterPurchaseTagOptions = [
        { value: 'Для всех товаров', id: 'default' },
    ];

    constructor(props) {
        super(props);

        const { document, localeKey } = this.props;

        this.defaultDocument = {
            name: '',
            type: undefined,
            tag: undefined,
            serviceId: this.props.selectedServiceId
        }

        this.state = this.getDocument(document, localeKey);
    }

    componentWillReceiveProps(nextProps: IProps) {
        const { document, localeKey, selectedServiceId } = nextProps;

        if (selectedServiceId !== this.props.selectedServiceId) {
            this.defaultDocument.serviceId = selectedServiceId
        }

        if (document !== this.props.document) {
            this.setState(this.getDocument(document, localeKey));
        }
    }

    getDocument = (document, localeKey): IState => {
        return document ? {
            name: document.name[localeKey],
            serviceId: document.serviceId,
            tag: document.tag,
            type: document.type,
        } : this.defaultDocument
    }

    saveDocument = () => {
        const { localeKey, onSave, document } = this.props;

        return this.formRef.current.runValidations().then((formErrors = {}) => {
            if (Object.keys(formErrors).length) { return; }

            const values = this.formRef.current.getFormikBag().values;
            values.tag = values.tag || undefined;
            return this.props.onSave({ value: { id: document && document.id, ...values, name: { [localeKey]: values.name } } });
        });
    }

    render() {
        const { localeKey, documentTypeOptions, contentType, document } = this.props;
        const title = contentType === 'addDocument' ? 'Добавить документ' : 'Редактировать документ';
        const {  name, type, tag, serviceId } = document || this.defaultDocument;
        const tagOptions = this[`${this.state.type}TagOptions`];

        return (
            <>
                <div className={`ml-s mb-m mr-s ${css.title}`}>{title}</div>
                <Inline className={classNames('mb-m', css.documentForm)}>
                    <div className="col-12">
                        <FormikVersionDetails
                            enableReinitialize
                            validationSchema={yup.object().shape({
                                name: yup.string().required('Необходимо заполнить название'),
                                type: yup.string().required('Необходимо указать тип документа')
                            })}
                            ref={this.formRef}
                            initialValues={{
                                name: name[localeKey],
                                type,
                                tag,
                                serviceId
                            }}
                            onSubmit={() => {}}
                            render={({ setFieldValue, values, errors }) => (<>
                                <Row>
                                    <Field>
                                        <Input
                                            locator="document-name"
                                            label="Название"
                                            placeholder="Укажи название"
                                            theme="light"
                                            value={values.name}
                                            onChange={(name) => {
                                                setFieldValue('name', name);
                                            }}
                                            status={errors.name ? 'error' : null}
                                            hint={errors.name && String(errors.name)}
                                        />
                                    </Field>
                                </Row>
                                <Row>
                                    <Field>
                                        <Apps
                                            locator="document-manager-apps"
                                            localChanges
                                            value={values.serviceId}
                                            onChange={(serviceIdValue) => {
                                                setFieldValue('serviceId', serviceIdValue.id);
                                            }}
                                            status={errors.serviceId ? 'error' : null}
                                            hint={errors.serviceId && String(errors.serviceId)}
                                        />
                                    </Field>
                                </Row>
                                <Row>
                                    <Field>
                                        <Select
                                            onChange={(type, option: IOption) => {
                                                setFieldValue('type', option.id);
                                                this.setState({ type: option.id });

                                                if (option.id === 'webshopAfterPurchase') {
                                                    setFieldValue('tag', 'default');
                                                } else {
                                                    setFieldValue('tag', '');
                                                }
                                            }}
                                            locator="documents-manager-type-select"
                                            title="Тип документа"
                                            placeholder="Укажи тип документа"
                                            theme="light"
                                            status={errors.type ? 'error' : null}
                                            hint={errors.type && String(errors.type)}
                                            options={documentTypeOptions}
                                            value={values.type}
                                        />
                                    </Field>
                                </Row>
                                {tagOptions && (
                                    <Row>
                                        <Field>
                                            <Select
                                                onChange={(type, option: IOption) => {
                                                    setFieldValue('tag', option.id);
                                                }}
                                                locator="documents-manager-tag-select"
                                                title="Тип документа"
                                                placeholder="Укажи тэг"
                                                theme="light"
                                                status={errors.tag ? 'error' : null}
                                                hint={errors.tag && String(errors.tag)}
                                                options={tagOptions}
                                                disabled={values.type === 'webshopAfterPurchase'}
                                                value={values.tag}
                                            />
                                        </Field>
                                    </Row>
                                )}
                            </>)}
                        />
                    </div>
                </Inline>
            </>
        );
    }
}

export default Document;
