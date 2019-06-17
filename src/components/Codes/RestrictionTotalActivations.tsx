import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';

import { IRestrictionTotalPromoCodeActivations } from 'src/entities/Codes/models/Restriction';

export class FormikTotalPromoCodeActivations extends Formik<{}, IRestrictionTotalPromoCodeActivations> {}

export interface IProps {
    formRef: React.RefObject<FormikTotalPromoCodeActivations>;
    component: IRestrictionTotalPromoCodeActivations;
}

export default ({ formRef, component }: IProps) => (
    <FormikTotalPromoCodeActivations
        ref={formRef}
        validationSchema={yup.object().shape({
            totalActivations: yup.number().integer().positive()
                .required('Необходимо ввести количество активаций')
                .typeError('Необходимо ввести число')
        })}
        initialValues={{ ...component }}
        onSubmit={() => {}}
        render={({ values, setFieldValue, errors }) => (
            <Input
                status={errors.totalActivations ? 'error' : null}
                hint={errors.totalActivations && String(errors.totalActivations)}
                theme="light"
                locator="activations-count-input"
                placeholder="Введи количество активаций"
                label="Максимальное кол-во активаций"
                value={values.totalActivations}
                onChange={(value: string) => {
                    setFieldValue('totalActivations', value);
                    component.totalActivations = value;
                }}
            />
        )}
    />
);
