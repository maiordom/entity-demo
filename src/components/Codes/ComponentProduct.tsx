import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';
import Select from 'ui/lib/Select';

import { IComponentProduct } from 'src/entities/Codes/models/Component';
import { IOption } from 'src/entities/Apps/store';

import { Row, Field } from 'src/components/Form/Form';

export class FormikComponentProduct extends Formik<{}, IComponentProduct> {}

export default ({
    formRef,
    component
}: {
    formRef: React.RefObject<FormikComponentProduct>;
    component: IComponentProduct;
}) => (
    <FormikComponentProduct
        ref={formRef}
        validationSchema={yup.object().shape({
            productId: yup.number().integer().positive()
                .required('Необходимо указать id продукта')
                .typeError('Необходимо ввести число'),
            productQuantity: yup.number().integer().positive()
                .required('Необходимо указать количество продуктов')
                .typeError('Необходимо ввести число')
        })}
        initialValues={{ ...component }}
        onSubmit={() => {}}
        render={({ values, setFieldValue, errors }) => (<>
            <Row>
                <Field>
                    <Input
                        status={errors.productId ? 'error' : null}
                        hint={errors.productId && String(errors.productId)}
                        theme="light"
                        locator="component-product-input"
                        placeholder="Введи id продукта"
                        label="Продукт"
                        value={values.productId && String(values.productId)}
                        onChange={(value: string) => {
                            setFieldValue('productId', value);
                            component.productId = Number(value);
                        }}
                    />
                </Field>
            </Row>
            <Row>
                <Field>
                    <Input
                        status={errors.productQuantity ? 'error' : null}
                        hint={errors.productQuantity && String(errors.productQuantity)}
                        theme="light"
                        locator="component-product-count-input"
                        placeholder="Введи количество продуктов"
                        label="Количество продуктов"
                        value={values.productQuantity && String(values.productQuantity)}
                        onChange={(value: string) => {
                            setFieldValue('productQuantity', value);
                            component.productQuantity = Number(value);
                        }}
                    />
                </Field>
            </Row>
        </>)}
    />
);
