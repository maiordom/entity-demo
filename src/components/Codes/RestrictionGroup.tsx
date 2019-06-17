import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';

import { IRestrictionGroup } from 'src/entities/Codes/models/Restriction';

class FormikGroup extends Formik<{}, {
    groupId?: string;
}> {}

export interface IProps {
    formRef: React.RefObject<FormikGroup>;
    component: IRestrictionGroup;
}

export default ({ formRef, component }: IProps) => (
    <FormikGroup
        ref={formRef}
        validationSchema={yup.object().shape({
            groupId: yup.string().required('Необходимо указать группу')
        })}
        initialValues={{}}
        onSubmit={() => {}}
        render={({ values, errors, setFieldValue }) => (
            <Input
                status={errors.groupId ? 'error' : null}
                hint={errors.groupId && String(errors.groupId)}
                theme="light"
                locator="restristion-group-input"
                placeholder="Введи id группы пользователей"
                label="Укажи id группы пользователей"
                value={values.groupId}
                onChange={(value: string) => {
                    setFieldValue('groupId', value);
                    component.groupId = value;
                }}
            />
        )}
    />
);
