import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';
import Select from 'ui/lib/Select';

import { IComponentDiscount, IDiscount } from 'src/entities/Codes/models/Component';
import { IOption } from 'src/entities/Apps/store';

import { Row, Field } from 'src/components/Form/Form';

export class FormikComponentDiscount extends Formik<{}, IDiscount> {}

const typeOptions = [
    { id: 'percent', value: 'percent' },
    { id: 'absolute', value: 'absolute' }
];

const setDiscount = (component: IComponentDiscount, changes: { type?: string; value?: number; }) => {
    if (!component.discount) {
        component.discount = {
            type: null,
            value: null
        };
    }

    Object.assign(component.discount, changes);
};

interface IProps {
    formRef: React.RefObject<FormikComponentDiscount>;
    component: IComponentDiscount;
}

export default class ComponentDiscount extends React.Component<IProps, any> {
    render() {
        const { formRef, component } = this.props;

        return (
            <FormikComponentDiscount
                ref={formRef}
                validationSchema={yup.object().shape({
                    value: yup.number().integer().positive()
                        .required('Необходимо указать величину скидки')
                        .typeError('Необходимо ввести число'),
                    type: yup.string().required('Выберите тип скидки')
                })}
                initialValues={{
                    value: component.discount && component.discount.value,
                    type: component.discount && component.discount.type
                }}
                onSubmit={() => {}}
                render={({ values, setFieldValue, errors }) => (<>
                    <Row>
                        <Field>
                            <Input
                                status={errors.value ? 'error' : null}
                                hint={errors.value && String(errors.value)}
                                theme="light"
                                locator="discount-input"
                                placeholder="Введи величину скидки"
                                label="Величина скидки"
                                value={values.value && String(values.value)}
                                onChange={(value: string) => {
                                    setFieldValue('value', value);
                                    setDiscount(component, { value: Number(value) });
                                }}
                            />
                        </Field>
                    </Row>
                    <Row>
                        <Field>
                            <Select
                                status={errors.type ? 'error' : null}
                                hint={errors.type && String(errors.type)}
                                theme="light"
                                locator="discount-type"
                                placeholder="Выбери тип скидки"
                                title="Тип скидки"
                                options={typeOptions}
                                value={values.type && String(values.type)}
                                onChange={(type: string) => {
                                    setFieldValue('type', type);
                                    setDiscount(component, { type });
                                }}
                            />
                        </Field>
                    </Row>
                </>)}
            />
        );
    }
}
