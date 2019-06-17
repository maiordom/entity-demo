import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';
import RadioGroup from 'ui/lib/RadioGroup';

import { IServerHTTPCheck } from 'src/entities/StatusMonitor/models/ServerChecks';
import { Row, Field } from 'src/components/Form/Form';

export interface IFormikServerHTTPCheckValues extends IServerHTTPCheck {}

export class ServerHTTPCheck extends Formik<{}, IFormikServerHTTPCheckValues> {}

const methodOptions = [
    { value: 'head', text: 'head', selected: true },
    { value: 'get', text: 'get' }
];

export const ServerHTTPCheckForm = ({
    values,
    onSubmit,
    innerRef
}: {
    values: IServerHTTPCheck;
    onSubmit: (values: IServerHTTPCheck) => void;
    innerRef: React.RefObject<ServerHTTPCheck>;
}) => (
    <ServerHTTPCheck
        ref={innerRef}
        initialValues={values}
        validationSchema={yup.object().shape({
            name: yup.string().required('Необходимо указать имя'),
            url: yup.string().required('Необходимо указать url')
        })}
        onSubmit={onSubmit}
        render={({ values, setFieldValue, errors }) => (<>
            <Row>
                <Field>
                    <Input
                        status={errors.name ? 'error' : null}
                        hint={errors.name && String(errors.name)}
                        theme="light"
                        value={values.name}
                        label="Название проверки"
                        placeholder="Укажите название проверки"
                        onChange={(name: string) => {
                            setFieldValue('name', name);
                        }}
                    />
                </Field>
            </Row>
            <Row col>
                <div className="label mb-s">Метод</div>
                <RadioGroup
                    onClick={(method: string) => {
                        setFieldValue('method', method);
                    }}
                    theme="light"
                    data={methodOptions.map(method => {
                        method.selected = method.value === values.method
                        return method;
                    })}
                />
            </Row>
            <Row>
                <Field>
                    <Input
                        status={errors.url ? 'error' : null}
                        hint={errors.url && String(errors.url)}
                        theme="light"
                        value={values.url}
                        label="URL"
                        placeholder="Укажите url"
                        onChange={(url: string) => {
                            setFieldValue('url', url);
                        }}
                    />
                </Field>
            </Row>
            <Row>
                <Field>
                    <Input
                        status={errors.host ? 'error' : null}
                        hint={errors.host && String(errors.host)}
                        theme="light"
                        value={values.host}
                        label="Хост"
                        placeholder="Укажите хост"
                        onChange={(host: string) => {
                            setFieldValue('host', host);
                        }}
                    />
                </Field>
            </Row>
        </>)}
    >
    </ServerHTTPCheck>
);
