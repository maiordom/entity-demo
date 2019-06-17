import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { Form, Row, Field } from 'src/components/Form/Form';
import { Reason } from 'src/components/Reason/Reason';

import api from 'src/routes/api';

import { ITransaction } from 'src/entities/Billing/models/Transaction';
import { IStore } from 'src/store';

import cancelPayment, { ICancelPaymentRequestParams } from 'src/entities/Billing/services/CancelPayment';

export interface IOwnProps {
    transaction: ITransaction;
    onComplete?: () => void;
}

export interface IProps {
    lang: string;
    loaders?: {
        cancelPayment: boolean;
    };
}

interface IActions {
    actions: {
        cancelPayment: (params: ICancelPaymentRequestParams) => void;
    };
}

interface IFormikCancelPaymentValues extends ICancelPaymentRequestParams {}

class FormikCancelPaymentManager extends Formik<{}, IFormikCancelPaymentValues> {}

import css from 'src/components/Overlay/Overlay.css';

class CancelPayment extends React.PureComponent<IProps & IActions & IOwnProps, any> {
    onSubmit = async (values: IFormikCancelPaymentValues) => {
        await this.props.actions.cancelPayment({
            ...values
        });

        this.props.onComplete();
    };

    render() {
        const { transaction, loaders, lang } = this.props;

        return (
            <FormikCancelPaymentManager
                validationSchema={
                    yup.object().shape({
                        amount: yup.number()
                            .min(1, 'Необходимо указать сумму для возврата')
                            .required('Необходимо указать сумму для возврата')
                    })
                }
                initialValues={{
                    paymentId: transaction.paymentId,
                    amount: '',
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                onSubmit={this.onSubmit}
                render={({ touched, errors, values, setFieldValue, handleSubmit }) => (
                    <Form className={`${css.container} pl-l pt-xl`}>
                        <div className="font-size-large mb-m">Отмена платежа</div>
                        <div className="col-6">
                            <Row>
                                <Field locator="payment-num" className="font-size-medium">
                                    Номер платежа: {values.paymentId}
                                </Field>
                            </Row>
                            <Row>
                                <Field locator="payment-count" className="font-size-medium">
                                    Количество: {transaction.amount}
                                </Field>
                            </Row>
                            <Row>
                                <Field locator="payment-from" className="font-size-medium">
                                    От кого: {transaction.userId}
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="payment-amount"
                                        status={touched.amount && errors.amount ? 'error' : null}
                                        hint={touched.amount && errors.amount && String(errors.amount)}
                                        label="Количество денег для возврата"
                                        placeholder="Укажи количество"
                                        theme="light"
                                        value={values.amount}
                                        onChange={(amount: string) => {
                                            setFieldValue('amount', amount);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Reason
                                values={values}
                                setFieldValue={setFieldValue}
                            />
                        </div>
                        <div className={`${css.panel} justify-content-space-between`}>
                            <Button
                                locator="save-button"
                                type="submit"
                                isLoading={loaders.cancelPayment}
                                onClick={handleSubmit}
                                className="col-6 flex-shrink-none"
                            >
                                Вернуть деньги
                            </Button>
                            <div className={css.errorContainer}>
                                <RequestStatus
                                    errorConfig={{
                                        showDetails: true,
                                        className: css.error
                                    }}
                                    className="ml-s"
                                    render={() => {
                                        return 'Деньги успешно возвращены';
                                    }}
                                    routes={[
                                        api.billing.cancelPayment
                                    ]}
                                />
                            </div>
                        </div>
                    </Form>
                )}
            />
        )
    }
}

const mapStateToProps = (state: IStore) => ({
    lang: state.area.selected.lang
});

const mapDispatchToProps = () => ({
    actions: {
        cancelPayment
    }
});

const CancelPaymentWithConnect = connect(mapStateToProps, mapDispatchToProps)(CancelPayment);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.billing.cancelPayment
    ]}>
        <CancelPaymentWithConnect {...props} />
    </RequestTracker>
);
