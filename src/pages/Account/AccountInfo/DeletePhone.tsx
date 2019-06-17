import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';

import { Form, Row, Field, Error } from 'src/components/Form/Form';
import { IAccount } from 'src/entities/Accounts/models/Account';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { IFormikValues, Reason } from 'src/components/Reason/Reason';
import { IStore } from 'src/store';

import { updateAccountAction as updateAccount, IGetAccountsRequestParams } from 'src/entities/Accounts/actions';
import { deletePhone, IDeletePhoneRequestParams } from 'src/entities/Auth/actions';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

class FormikDeletePhone extends Formik<{}, IFormikValues> {}

import api from 'src/routes/api';

interface IProps {
    lang?: string;
    account: IAccount;
    loaders?: {
        deletePhone: boolean;
    };
}

interface IActions {
    actions: {
        deletePhone: (params: IDeletePhoneRequestParams) => void;
        updateAccount: (params: IGetAccountsRequestParams) => void;
    };
}

import css from 'src/components/Overlay/Overlay.css';

class DeletePhone extends React.PureComponent<IProps & IActions, any> {
    onSubmit = async(params: IFormikValues) => {
        const { account } = this.props;

        await this.props.actions.deletePhone({
            userId: account.id,
            reason: params.reason
        });

        await this.props.actions.updateAccount({ contact: account.id });
    };

    render() {
        const { account, loaders, lang } = this.props;

        return (
            <FormikDeletePhone
                initialValues={{
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, handleSubmit }) => (<>
                    <Form locator="delete-phone" className={`${css.container} pl-l pt-xl`}>
                        <div className="font-size-large mb-m">Удалить телефон</div>
                        <div className="col-6">
                            <Row>
                                <Field>
                                    <Input
                                        locator="input-current-phone"
                                        disabled
                                        label="Текущий телефон"
                                        value={account.phone}
                                        theme="light"
                                    />
                                </Field>
                            </Row>
                            <Reason
                                values={values}
                                setFieldValue={setFieldValue}
                            />
                        </div>
                    </Form>
                    <div className={css.panel}>
                        <Button
                            locator="button-delete-phone"
                            isLoading={loaders.deletePhone}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Удалить телефон
                        </Button>
                        <div className={css.errorContainer}>
                            <Error className={css.error} route={api.auth.deletePhone} />
                            <RequestStatus
                                className="ml-s"
                                render={() => 'Телефон успешно удален'}
                                route={api.auth.deletePhone}
                            />
                        </div>
                    </div>
                </>)}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    lang: state.area.selected.lang
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        deletePhone,
        updateAccount
    }, dispatch)
});

const DeletePhoneWithConnect = connect(mapStateToProps, mapDispatchToProps)(DeletePhone);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.auth.deletePhone
    ]}>
        <DeletePhoneWithConnect {...props} />
    </RequestTracker>
);