import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import { prolongManySubscriptions, IProlongManySubscriptionsRequestParams, IGetJobResult } from 'src/entities/Subscription/actions';

import { Reason, IFormikValues } from 'src/components/Reason/Reason';
import Apps, { IAppsOptions } from 'src/components/Apps/Apps';
import { Row, Field, SimpleError, Error } from 'src/components/Form/Form';
import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { IStore } from 'src/store';
import api from 'src/routes/api';

interface IProps {
    apps: IAppsOptions;
    lang: string;
}

interface IActions {
    actions: {
        prolongManySubscriptions: (params: IProlongManySubscriptionsRequestParams) => Promise<IGetJobResult>;
    };
}

interface IFormikMassSubscriptionValues extends IFormikValues {
    days?: string;
    logins?: string;
    toPartnerId?: string;
}

interface IState {
    failed: IGetJobResult['failed'];
    loaders: {
        prolongManySubscriptions: boolean;
    };
}

class FormikProlongManySubscriptions extends Formik<{}, IFormikMassSubscriptionValues> {}

class MassSubscription extends React.PureComponent<IProps & IActions, IState> {
    state = {
        failed: {},
        loaders: {
            prolongManySubscriptions: false
        }
    };

    onSubmit = (params: IFormikMassSubscriptionValues) => {
        this.setState({ failed: {}, loaders: { prolongManySubscriptions: true } });
        this.props.actions.prolongManySubscriptions({
            logins: params.logins.split(',').map(login => login.trim()),
            toPartnerId: params.toPartnerId,
            days: Number(params.days),
            reason: params.reason
        }).then(({ failed }) => {
            const state: IState = {
                failed: {},
                loaders: { prolongManySubscriptions: false }
            };

            if (Object.keys(failed).length) {
                state.failed = failed;
            }

            this.setState(state);
        }).catch(() => {
            this.setState({ loaders: { prolongManySubscriptions: false } });
        });
    };

    render() {
        const { loaders, failed } = this.state;
        const wasFailed = Object.keys(failed).length > 0;
        const { apps, lang } = this.props;
        const toPartnerId = apps.selected.id ? String(apps.selected.id) : '';

        return (
            <Container>
                <Title>Подписки</Title>
                <FormikProlongManySubscriptions
                    validateOnChange={false}
                    initialValues={{
                        toPartnerId,
                        days: '',
                        reason: {
                            internal: '',
                            external: {
                                [lang]: ''
                            }
                        }
                    }}
                    onSubmit={this.onSubmit}
                    validationSchema={yup.object().shape({
                        logins: yup.string().required('Необходимо указать логины'),
                        toPartnerId: yup.string().required('Необходимо выбрать сервис'),
                        days: yup.number().min(1, 'Необходимо указать количество дней').required('Необходимо указать количество дней')
                    })}
                    render={({ values, errors, setFieldValue, handleSubmit }) => (
                        <Inner className="col-7 ml-xl mt-xl pb-l">
                            <Row>
                                <Field>
                                    <Apps locator="subscriptions" onChange={(option) => {
                                        setFieldValue('toPartnerId', option.id);
                                    }} />
                                </Field>
                            </Row>
                            {errors.toPartnerId && (
                                <SimpleError className="text-align-left mt-s">{errors.toPartnerId}</SimpleError>
                            )}
                            <Row>
                                <Field>
                                    <Input
                                        locator="logins-input"
                                        status={errors.logins ? 'error' : null}
                                        hint={errors.logins ? String(errors.logins) : null}
                                        label="Введите логины через запятую"
                                        placeholder="Укажи логины для продления подписки"
                                        theme="light"
                                        onChange={(logins: string) => {
                                            setFieldValue('logins', logins);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="days-count-input"
                                        status={errors.days ? 'error' : null}
                                        hint={errors.days ? String(errors.days) : null}
                                        label="Количество дней"
                                        placeholder="Укажи количество дней"
                                        theme="light"
                                        onChange={(days: string) => {
                                            setFieldValue('days', days);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Reason
                                values={values}
                                setFieldValue={setFieldValue}
                            />
                            <Row>
                                <Button
                                    locator="prolong-button"
                                    isLoading={loaders.prolongManySubscriptions}
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="col-7"
                                >
                                    Продлить подписку
                                </Button>
                            </Row>
                        </Inner>
                    )}
                />
                <Error showDetails className="text-align-left line-height-s ml-xl mb-m" route={api.subscription.prolongManySubscriptions} />
                <Error showDetails className="text-align-left line-height-s ml-xl mb-m" route={api.jobs.getJob} />
                {wasFailed && (<div className="ml-xl pb-xl col-12">
                    {Object.keys(failed).map(key => (
                        <SimpleError locator="prolong" className="text-align-left mb-m">Ошибка для аккаунта с id {key}: {failed[key]}</SimpleError>
                    ))}
                </div>)}
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    apps: state.appsOptions,
    lang: state.area.selected.lang
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ prolongManySubscriptions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MassSubscription);
