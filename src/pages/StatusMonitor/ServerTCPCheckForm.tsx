import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';

import { IServerTCPCheck } from 'src/entities/StatusMonitor/models/ServerChecks';
import { Row, Field } from 'src/components/Form/Form';

export interface IFormikServerTCPCheckValues extends IServerTCPCheck {}

export class ServerTCPCheck extends Formik<{}, IFormikServerTCPCheckValues> {}

export const ServerTCPCheckForm = ({
    values,
    onSubmit,
    innerRef
}: {
    values: IServerTCPCheck;
    onSubmit: (values: IServerTCPCheck) => void;
    innerRef: React.RefObject<ServerTCPCheck>;
}) => (
    <ServerTCPCheck
        ref={innerRef}
        initialValues={values}
        validationSchema={yup.object().shape({
            name: yup.string().required('Необходимо указать имя'),
            port: yup.string().required('Необходимо указать порт')
                .matches(/^\d+$/, {
                    message: 'Необходимо указать порт',
                    excludeEmptyString: true
                }),
            host: yup.string().required('Необходимо указать хост')
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
            <Row>
                <Field>
                    <Input
                        status={errors.port ? 'error' : null}
                        hint={errors.port && String(errors.port)}                                        
                        theme="light"
                        value={values.port}
                        label="Порт"
                        placeholder="Укажите порт"
                        onChange={(port: string) => {
                            setFieldValue('port', port);
                        }}
                    />
                </Field>
            </Row>
        </>)}
    >
    </ServerTCPCheck>
);
