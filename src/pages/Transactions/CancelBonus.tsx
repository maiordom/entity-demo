import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { Form, Row, Field } from 'src/components/Form/Form';
import { Reason } from 'src/components/Reason/Reason';

import api from 'src/routes/api';

import { ITransaction } from 'src/entities/Billing/models/Transaction';
import { IStore } from 'src/store';

import cancelBonus, { ICancelBonusRequestParams } from 'src/entities/Billing/services/CancelBonus';

export interface IOwnProps {
    transaction: ITransaction;
    onComplete?: () => void;
}

export interface IProps {
    lang: string;
    loaders?: {
        cancelBonus: boolean;
    };
}

interface IActions {
    actions: {
        cancelBonus: (params: ICancelBonusRequestParams) => void;
    };
}

interface IFormikCancelBonusValues extends ICancelBonusRequestParams {}

class FormikCancelBonusManager extends Formik<{}, IFormikCancelBonusValues> {}

import css from 'src/components/Overlay/Overlay.css';

class CancelBonus extends React.PureComponent<IProps & IActions & IOwnProps, any> {
    onSubmit = async (values: IFormikCancelBonusValues) => {
        await this.props.actions.cancelBonus({
            ...values
        });

        this.props.onComplete();
    };

    render() {
        const { transaction, loaders, lang } = this.props;

        return (
            <FormikCancelBonusManager
                initialValues={{
                    bonusId: transaction.bonusId,
                    amount: '',
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, handleSubmit }) => (
                    <Form className={`${css.container} pl-l pt-xl`}>
                        <div className="font-size-large mb-m">Отмена бонусов</div>
                        <div className="col-6">
                            <Row>
                                <Field className="font-size-medium">
                                    bonusId: {values.bonusId}
                                </Field>
                            </Row>
                            <Row>
                                <Field className="font-size-medium">
                                    Количество: {transaction.amount}
                                </Field>
                            </Row>
                            <Row>
                                <Field className="font-size-medium">
                                    От кого: {transaction.userId}
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        label="Количество бонусов для возврата"
                                        placeholder="Укажи количество"
                                        theme="light"
                                        value={values.amount}
                                        onChange={(id: string) => {
                                            setFieldValue('amount', id);
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
                                isLoading={loaders.cancelBonus}
                                onClick={handleSubmit}
                                className="col-6 flex-shrink-none"
                            >
                                Вернуть бонусы
                            </Button>
                            <div className={css.errorContainer}>
                                <RequestStatus
                                    errorConfig={{
                                        showDetails: true,
                                        className: css.error
                                    }}
                                    className="ml-s"
                                    render={() => {
                                        return 'Бонусы успешно возвращены';
                                    }}
                                    routes={[
                                        api.billing.cancelBonus
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
        cancelBonus
    }
});

const CancelBonusWithConnect = connect(mapStateToProps, mapDispatchToProps)(CancelBonus);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.billing.cancelBonus
    ]}>
        <CancelBonusWithConnect {...props} />
    </RequestTracker>
);
