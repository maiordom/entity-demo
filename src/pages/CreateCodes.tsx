import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { withRouter, RouteComponentProps } from 'react-router';
import pickBy from 'lodash/pickBy';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { IStore } from 'src/store';

import Apps, { IAppsOptions } from 'src/components/Apps/Apps';
import Components from 'src/components/Codes/Components';
import Restrictions from 'src/components/Codes/Restrictions';
import Panel from 'src/components/Panel/Panel';
import { Row, Field, Error } from 'src/components/Form/Form';
import clientRoutes from 'src/routes/client';
import { IValue } from 'src/types/IValue';
import { IAreaItem } from 'src/entities/Area/store';

import api from 'src/routes/api';

import { createCodes, ICreateCodeParams } from 'src/entities/Codes/actions';
import { matchToPath, IMatchToPathParams } from 'src/entities/Navigation/actions';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

interface IProps {
    area: IAreaItem;
    apps: IAppsOptions;
    loaders: {
        createCodes: boolean;
    };
}

interface IActions {
    actions: {
        createCodes: (params: ICreateCodeParams) => void;
        matchToPath: (params: IMatchToPathParams) => void;
    };
}

interface IFomrikGeneralValues {
    name: string;
    description: IValue;
    batch: number;
    code?: string;
}

class FormikGeneral extends Formik<{}, IFomrikGeneralValues> {}

type TProps = IProps & IActions & RouteComponentProps<any>;

class CreateCodesComponent extends React.PureComponent<TProps, any> {
    componentsRef: React.RefObject<Components> = React.createRef();
    restrictionsRef: React.RefObject<Restrictions> = React.createRef();
    generalFieldsRef: React.RefObject<FormikGeneral> = React.createRef();

    onGenerateCodesClick = (values: IFomrikGeneralValues) => {
        const components = this.componentsRef.current.getComponents();
        const restrictions = this.restrictionsRef.current.getRestrictions();

        values = pickBy(values, (value) => value !== '');

        const params: ICreateCodeParams = {
            name: values.name,
            description: values.description,
            batch: values.batch,
            promoCode: {
                activateOnlyOnce: true,
                serviceId: String(this.props.apps.selected.id),
                components,
                restrictions
            }
        };

        if (values.code) {
            params.promoCode.code = values.code;
        }

        Promise.all([
            this.componentsRef.current.validate(),
            this.restrictionsRef.current.validate()
        ]).then(() => {
            this.props.actions.createCodes(params);
        });
    };

    onCancelClick = () => {
        this.props.actions.matchToPath({ path: clientRoutes.codes });
        this.props.history.push(clientRoutes.codes);
    };

    render() {
        const { apps, loaders, area: { lang } } = this.props;

        return (
            <Container>
                <Title>Генерация промо-кодов</Title>
                <FormikGeneral
                    ref={this.generalFieldsRef}
                    initialValues={{
                        batch: 1,
                        name: '',
                        description: {
                            [lang]: ''
                        },
                        code: ''
                    }}
                    validationSchema={yup.object().shape({
                        description: yup.object().shape({
                            [lang]: yup.string().max(60, 'Максимум 60 символов для описания'),
                        }),
                        batch: yup.number()
                            .min(1, 'Количество кодов должно быть больше 1')
                            .required('Укажите количество кодов')
                            .typeError('Необходимо указать число'),
                        name: yup.string().required('Необходимо указать название эмиссии')
                    })}
                    onSubmit={this.onGenerateCodesClick}
                    render={({ setFieldValue, values, handleSubmit, errors }) => (<>
                        <Inner className="mt-xl pb-xxl ml-xl">
                            <div className="col-6 mb-m">
                                <Apps locator="codes" />
                            </div>
                            <div className="col-6 mb-xl">
                                <Row>
                                    <Field>
                                        <Input
                                            status={errors.name ? 'error' : null}
                                            hint={errors.name && String(errors.name)}
                                            theme="light"
                                            locator="emission-input"
                                            label="Название эмиссии"
                                            value={values.name}
                                            placeholder="Укажи название эмиссии"
                                            onChange={(name: string) => {
                                                setFieldValue('name', name);
                                            }}
                                        />
                                    </Field>
                                </Row>
                                <Row>
                                    <Field>
                                        <Input
                                            status={errors.description && errors.description[lang] ? 'error' : null}
                                            hint={errors.description && errors.description[lang] && String(errors.description[lang])}
                                            theme="light"
                                            locator="description-input"
                                            label="Описание"
                                            value={values.description[lang]}
                                            placeholder="Не более 60 символов, отображается юзеру"
                                            onChange={(description: string) => {
                                                setFieldValue(`description.${lang}`, description);
                                            }}
                                        />
                                    </Field>
                                </Row>
                                <Row>
                                    <Field>
                                        <Input
                                            status={errors.batch ? 'error' : null}
                                            hint={errors.batch && String(errors.batch)}
                                            theme="light"
                                            locator="count-input"
                                            label="Количество кодов"
                                            value={String(values.batch)}
                                            placeholder="Укажи количество кодов"
                                            onChange={(batch: string) => {
                                                setFieldValue('batch', batch);
                                            }}
                                        />
                                    </Field>
                                </Row>
                                <Row>
                                    <Field>
                                        <Input
                                            status={errors.code ? 'error' : null}
                                            hint={errors.code && String(errors.code)}
                                            theme="light"
                                            locator="code-input"
                                            label="Код"
                                            value={String(values.code)}
                                            placeholder="Укажи код"
                                            onChange={(code: string) => {
                                                setFieldValue('code', code);
                                            }}
                                        />
                                    </Field>
                                </Row>
                            </div>
                            <div className="mb-xl">
                                <Components apps={apps.items} ref={this.componentsRef} />
                            </div>
                            <Restrictions ref={this.restrictionsRef} />
                        </Inner>
                        <Panel>
                            <Button
                                locator="generate-codes-button"
                                className="col-6"
                                isLoading={loaders.createCodes}
                                onClick={handleSubmit}
                            >
                                Сгенерировать коды
                            </Button>
                            <Button
                                locator="cancel-button"
                                onClick={this.onCancelClick}
                                className="ml-s"
                                theme="thin-black"
                            >
                                Отменить
                            </Button>
                            <Error className="ml-s" route={api.codes.createCodes} />
                        </Panel>
                    </>)}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    apps: state.appsOptions,
    area: state.area.selected
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ createCodes, matchToPath }, dispatch)
});

const CreateCodes = withRouter<TProps>(connect(mapStateToProps, mapDispatchToProps)(CreateCodesComponent));

export default (props: TProps) => (
    <RequestTracker loaders={[
        api.codes.createCodes
    ]}>
        <CreateCodes {...props} />
    </RequestTracker>
);
