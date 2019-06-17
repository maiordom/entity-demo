import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import { Reason, IFormikValues } from 'src/components/Reason/Reason';
import { IGameAccount } from 'src/entities/GameAuth/models/GameAccount';
import { Form, Row, Field, Error } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { IStore } from 'src/store';
import api from 'src/routes/api';

import { prolongSubscription, IProlongSubscriptionRequestParams } from 'src/entities/Subscription/actions';

interface IFormikGameAccountSubscriptionValues extends IFormikValues {
    days?: string;
}

interface IProps {
    lang?: string;
    userId: string;
    account: IGameAccount;
    loaders?: {
        prolongSubscription: boolean;
    };
}

interface IActions {
    actions: {
        prolongSubscription: (userId: string, params: IProlongSubscriptionRequestParams) => void;
    };
}

class FormikSubscriptionManager extends Formik<{}, IFormikGameAccountSubscriptionValues> {}

import css from 'src/components/Overlay/Overlay.css';

class GameAccountSubscriptionManager extends React.PureComponent<IProps & IActions, any> {
    onSubmit = (params: IFormikGameAccountSubscriptionValues) => {
        const { account, userId } = this.props;

        this.props.actions.prolongSubscription(userId, {
            login: account.login,
            toPartnerId: account.partnerId,
            days: Number(params.days),
            reason: params.reason
        });
    };

    render() {
        const { account, loaders, lang } = this.props;

        return (
            <FormikSubscriptionManager
                initialValues={{
                    days: '',
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                validationSchema={
                    yup.object().shape({
                        days: yup.number()
                            .min(1, 'Укажите целое число дней подписки. Число должно быть больше 0.')
                            .required('Укажите целое число дней подписки. Число должно быть больше 0.')
                    })
                }
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, errors, handleSubmit }) => (
                    <Form className={`${css.container} pl-l pt-xl`}>
                        <div className="font-size-large mb-m">Подписка</div>
                        <div className="col-6">
                            <Row>
                                <Field>
                                    <Input
                                        disabled
                                        label="Логин"
                                        value={account.login}
                                        theme="light"
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        disabled
                                        label="Сервис"
                                        value={account.partnerId}
                                        theme="light"
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
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
                        </div>
                        <div className={css.panel}>
                            <Button
                                isLoading={loaders.prolongSubscription}
                                onClick={handleSubmit}
                                type="submit"
                                className="col-6"
                            >
                                Продлить подписку
                            </Button>
                            <div className={css.errorContainer}>
                                <Error className={css.error} route={api.subscription.prolongSubscription} />
                            </div>
                        </div>
                    </Form>
                )}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    lang: state.area.selected.lang
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        prolongSubscription
    }, dispatch)
});

const GameAccountSubscriptionManagerWithConnect = connect(mapStateToProps, mapDispatchToProps)(GameAccountSubscriptionManager);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.subscription.prolongSubscription
    ]}>
        <GameAccountSubscriptionManagerWithConnect {...props} />
    </RequestTracker>
);
