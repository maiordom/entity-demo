import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';

import { Form, Row, Field, Error } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { IAccount } from 'src/entities/Accounts/models/Account';
import { IRequest } from 'src/entities/RequestJournal/store';
import { IFormikValues, Reason } from 'src/components/Reason/Reason';
import { IStore } from 'src/store';

import { resetEmail, IResetEmailRequestParams } from 'src/entities/Auth/actions';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

interface IFormikEmailResetValues extends IFormikValues {
    email: string;
}

interface IProps {
    lang?: string;
    account: IAccount;
    loaders?: {
        resetEmail: boolean;
    };
}

interface IActions {
    actions: {
        resetEmail: (params: IResetEmailRequestParams) => void;
    };
}

class FormikResetEmail extends Formik<{}, IFormikEmailResetValues> {}

import api from 'src/routes/api';

import css from 'src/components/Overlay/Overlay.css';

class EmailReset extends React.PureComponent<IProps & IActions, any> {
    onSubmit = (params: IFormikEmailResetValues) => {
        this.props.actions.resetEmail({
            userId: this.props.account.id,
            email: params.email,
            reason: params.reason
        });
    };

    render() {
        const { loaders, lang } = this.props;

        return (
            <FormikResetEmail
                initialValues={{
                    email: '',
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, handleSubmit }) => (<>
                    <Form locator="change-email" className={`${css.container} pl-l pt-xl`}>
                        <div className="col-6">
                            <div className="font-size-large mb-m">Изменить email</div>
                            <Row>
                                <Field>
                                    <Input
                                        locator="input-new-email"
                                        label="Новый e-mail"
                                        placeholder="Укажите новую почту"
                                        theme="light"
                                        value={values.email}
                                        onChange={(value: string) => {
                                            setFieldValue('email', value);
                                        }}
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
                            locator="button-change-email"
                            isLoading={loaders.resetEmail}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Изменить
                        </Button>
                        <div className={css.errorContainer}>
                            <Error
                                className={css.error}
                                route={api.auth.resetEmail}
                            />
                            <RequestStatus
                                className="ml-s"
                                render={(request: IRequest) => `
                                    Запрос на смену почты успешно отправлен по адресу ${request.data.email}
                                `}
                                route={api.auth.resetEmail}
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
        resetEmail
    }, dispatch)
});

const EmailResetWithConnect = connect(mapStateToProps, mapDispatchToProps)(EmailReset);

export default (props: IProps) => (
    <RequestTracker loaders={[ api.auth.resetEmail ]}>
        <EmailResetWithConnect {...props} />
    </RequestTracker>
);
