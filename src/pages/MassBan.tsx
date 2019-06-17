import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment, { Moment } from 'moment';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import { banManyGameAccounts, IBanManyGameAccountsRequestParams, IGetJobResult } from 'src/entities/GameAuth/actions';

import { Reason, IFormikValues } from 'src/components/Reason/Reason';
import SingleDatePicker from 'src/components/Calendar/Calendar';
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
        banManyGameAccounts: (params: IBanManyGameAccountsRequestParams) => Promise<IGetJobResult>;
    };
}

interface IFormikMassBanValues extends IFormikValues {
    date?: string;
    logins?: string;
    toPartnerId?: string;
}

interface IState {
    failed: IGetJobResult['failed'];
    loaders: {
        banManyGameAccounts: boolean;
    };
}

class FormikBanManyAccounts extends Formik<{}, IFormikMassBanValues> {}

class MassBan extends React.PureComponent<IProps & IActions, IState> {
    state = {
        failed: {},
        loaders: {
            banManyGameAccounts: false
        }
    };

    onSubmit = (params: IFormikMassBanValues) => {
        this.setState({ failed: {}, loaders: { banManyGameAccounts: true } });
        this.props.actions.banManyGameAccounts({
            logins: params.logins.split(',').map(login => login.trim()),
            toPartnerId: params.toPartnerId,
            date: moment(params.date).utc().format(),
            reason: params.reason
        }).then(({ failed }) => {
            const state: IState = {
                failed: {},
                loaders: { banManyGameAccounts: false }
            };

            if (Object.keys(failed).length) {
                state.failed = failed;
            }

            this.setState(state);
        }).catch(() => {
            this.setState({ loaders: { banManyGameAccounts: false } });
        });
    };

    render() {
        const { loaders, failed } = this.state;
        const wasFailed = Object.keys(failed).length > 0;
        const { apps, lang } = this.props;
        const toPartnerId = apps.selected.id ? String(apps.selected.id) : '';

        return (
            <Container>
                <Title>Баны</Title>
                <FormikBanManyAccounts
                    validateOnChange={false}
                    initialValues={{
                        toPartnerId,
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
                        date: yup.string().required('Необходимо указать дату бана')
                    })}
                    render={({ values, errors, setFieldValue, handleSubmit }) => (
                        <Inner className="col-7 ml-xl mt-xl pb-l">
                            <Row>
                                <Field>
                                    <Apps locator="mass-ban" onChange={(option) => {
                                        setFieldValue('toPartnerId', option.id);
                                    }} />
                                </Field>
                            </Row>
                            {errors.toPartnerId && (
                                <SimpleError
                                    className="text-align-left mt-s"
                                >
                                    {errors.toPartnerId}
                                </SimpleError>
                            )}
                            <Row>
                                <Field>
                                    <Input
                                        locator="logins-input"
                                        status={errors.logins ? 'error' : null}
                                        hint={errors.logins ? String(errors.logins) : null}
                                        label="Введите логины через запятую"
                                        placeholder="Укажи логины для бана"
                                        theme="light"
                                        onChange={(logins: string) => {
                                            setFieldValue('logins', logins);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Reason
                                values={values}
                                setFieldValue={setFieldValue}
                            />
                            <Row col>
                                <div className="label">Заблокировать до</div>
                                <Row className="mt-none">
                                    <Field className="mr-s">
                                        <SingleDatePicker
                                            openDirection="up"
                                            placeholder="Укажите дату"
                                            onChange={(date: Moment) => {
                                                setFieldValue('date', date && date.format() || '');
                                            }}
                                            showClearDate
                                        />
                                    </Field>
                                </Row>
                            </Row>
                            {errors.date && (
                                <SimpleError className="text-align-left mt-s">{errors.date}</SimpleError>
                            )}
                            <Row>
                                <Button
                                    locator="ban-button"
                                    isLoading={loaders.banManyGameAccounts}
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="col-7"
                                >
                                    Забанить
                                </Button>
                            </Row>
                        </Inner>
                    )}
                />
                <Error
                    showDetails
                    className="text-align-left line-height-s ml-xl mb-m"
                    route={api.gameAuth.banManyGameAccounts}
                />
                <Error
                    showDetails
                    className="text-align-left line-height-s ml-xl mb-m"
                    route={api.jobs.getJob}
                />
                {wasFailed && (<div className="ml-xl pb-xl col-12">
                    {Object.keys(failed).map(key => (
                        <SimpleError
                            locator="ban"
                            className="text-align-left mb-m"
                        >
                            Ошибка для аккаунта с id {key}: {failed[key]}
                        </SimpleError>
                    ))}
                </div>)}
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    apps: state.appsOptions,
    lang: state.area.selected.lang
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ banManyGameAccounts }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MassBan);
