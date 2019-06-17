import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import Button from 'ui/lib/Button';
import Suggest from 'ui/lib/Suggest';
import Spinner from 'ui/lib/Spinner';
import { IOption } from 'src/entities/Apps/store';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { Form, Row, Field } from 'src/components/Form/Form';
import { Reason } from 'src/components/Reason/Reason';

import api from 'src/routes/api';

import { ITransaction } from 'src/entities/Billing/models/Transaction';
import { IStore } from 'src/store';

import transferPayment, { ITransferPaymentParams } from 'src/entities/Billing/services/TransferPayment';
import { getAccounts, IGetAccountsRequestParams, IGetAccountsResult } from 'src/entities/Accounts/services/GetAccounts';

export interface IOwnProps {
    contact: string;
    transaction: ITransaction;
    onComplete?: () => void;
}

export interface IProps {
    lang: string;
    loaders?: {
        transferPayment: boolean;
        getAccounts: boolean;
    };
}

interface IActions {
    actions: {
        transferPayment: (params: ITransferPaymentParams) => void;
        getAccounts: (params: IGetAccountsRequestParams) => Promise<IGetAccountsResult>;
    };
}

interface IState {
    options: Array<ISuggestOption>;
    suggestValue: {
        value: string;
    };
}

interface ISuggestOption extends IOption {
    contact: string;
}

interface IFormikTransferPaymentValues extends ITransferPaymentParams {}

class FormikTransferPaymentManager extends Formik<{}, IFormikTransferPaymentValues> {}

import overlayCSS from 'src/components/Overlay/Overlay.css';
import css from './TransferPayment.css';

class TransferPayment extends React.PureComponent<IProps & IActions & IOwnProps, IState> {
    state = {
        options: [],
        suggestValue: {
            value: ''
        }
    };

    onSubmit = async (values: IFormikTransferPaymentValues) => {
        await this.props.actions.transferPayment({
            ...values
        });

        this.props.onComplete && this.props.onComplete();
    };

    onGetAccounts = async(value: string) => {
        this.setState({ suggestValue: { value } });

        const { accounts: [ account ] } = await this.props.actions.getAccounts({ contact: value });

        if (account) {
            let matchKey = 'id';

            ['username', 'email'].forEach(key => {
                if (account[key] === value) {
                    matchKey = key;
                }
            });

            this.setState({
                options: [{
                    id: account.id,
                    value: account[matchKey],
                    contact: account.username || account.email || account.id
                }]
            });
        } else {
            this.setState({ options: [] });
        }
    };

    renderAccount = (option: ISuggestOption) => {
        return (
            <div>{option.contact} (id: {option.id})</div>
        );
    };

    render() {
        const { transaction, loaders, lang, contact } = this.props;
        const { options, suggestValue } = this.state;

        return (
            <FormikTransferPaymentManager
                initialValues={{
                    paymentId: transaction.paymentId,
                    receiverUserId: '',
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, handleSubmit }) => (
                    <Form className={`${overlayCSS.container} pl-l pt-xl`}>
                        <div className="font-size-large mb-m">Трансфер платежа на другой аккаунт</div>
                        <div className="col-6">
                            <Row>
                                <Field className="font-size-medium">
                                    Номер платежа: {values.paymentId}
                                </Field>
                            </Row>
                            <Row>
                                <Field className="font-size-medium">
                                    От кого: {contact} (id: {transaction.userId})
                                </Field>
                            </Row>
                            <Row className="position-relative">
                                <Field>
                                    <Suggest
                                        locator="transfer-to-suggest"
                                        value={suggestValue}
                                        checkOnlySelectedIndex
                                        itemClassName={`${css.suggestOption} font-size-medium`}
                                        label="Получатель"
                                        placeholder="Укажи контакт"
                                        theme="light"
                                        filter={() => true}
                                        items={options}
                                        onInputChange={this.onGetAccounts}
                                        onChange={(option: ISuggestOption) => {
                                            if (option.id) {
                                                setFieldValue('receiverUserId', option.id);

                                                this.setState({
                                                    suggestValue: {
                                                        value: `${option.contact} (id: ${option.id})`
                                                    }
                                                });
                                            }
                                        }}
                                        optionRenderer={this.renderAccount}
                                    />
                                    {loaders.getAccounts && (
                                        <Spinner size="small" className={css.spinner} />
                                    )}
                                </Field>
                            </Row>
                            <Reason
                                values={values}
                                setFieldValue={setFieldValue}
                            />
                        </div>
                        <div className={`${overlayCSS.panel} justify-content-space-between`}>
                            <Button
                                locator="transfer-button"
                                type="submit"
                                isLoading={loaders.transferPayment}
                                onClick={handleSubmit}
                                className="col-6 flex-shrink-none"
                            >
                                Переместить платеж
                            </Button>
                            <div className={overlayCSS.errorContainer}>
                                <RequestStatus
                                    errorConfig={{
                                        showDetails: true,
                                        className: overlayCSS.error
                                    }}
                                    className="ml-s"
                                    render={() => {
                                        return 'Платеж успешно перемещен';
                                    }}
                                    routes={[
                                        api.billing.transferPayment
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
        transferPayment,
        getAccounts
    }
});

const TransferPaymentWithConnect = connect(mapStateToProps, mapDispatchToProps)(TransferPayment);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.billing.transferPayment,
        api.accounts.getAccounts

    ]}>
        <TransferPaymentWithConnect {...props} />
    </RequestTracker>
);
