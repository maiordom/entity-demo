import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Apps from 'src/components/Apps/Apps';
import { IComponentBetaTestingAccept } from 'src/entities/Codes/models/Component';

import { IOption } from 'src/entities/Apps/store';

export class FormikComponentBetaTesting extends Formik<{}, IComponentBetaTestingAccept> {}

export default ({
    formRef,
    component
}: {
    formRef: React.RefObject<FormikComponentBetaTesting>;
    component: IComponentBetaTestingAccept;
}) => (
    <FormikComponentBetaTesting
        ref={formRef}
        initialValues={{ ...component }}
        validationSchema={yup.object().shape({
            betaTestingServiceId: yup.string().required('Выберите id сервиса')
        })}
        onSubmit={() => {}}
        render={({ values, setFieldValue, errors }) => (
            <Apps
                localChanges
                status={errors.betaTestingServiceId && 'error'}
                hintClassName={errors.betaTestingServiceId && 'hint-error'}
                hint={errors.betaTestingServiceId && String(errors.betaTestingServiceId)}
                locator="betatest-apps"
                mods={['font-size-medium']}
                title="Укажите сервис"
                placeholder="Выберите сервис"
                value={values.betaTestingServiceId}
                onChange={(option: IOption) => {
                    component.betaTestingServiceId = String(option.id);
                    setFieldValue('betaTestingServiceId', option.id);
                }}
            />
        )}
    />
);
