import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import { Form, Row, Field, Error } from 'src/components/Form/Form';
import { IAccount } from 'src/entities/Accounts/models/Account';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { IRequest } from 'src/entities/RequestJournal/store';
import { IStore } from 'src/store';
import { IFormikValues, Reason } from 'src/components/Reason/Reason';

import { changeProfile, IChangeProfileRequestParams } from 'src/entities/Auth/actions';
import { updateAccountAction as updateAccount, IGetAccountsRequestParams } from 'src/entities/Accounts/actions';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

interface IFormikChangeProfileValues extends IFormikValues {
    firstName: string;
    lastName: string;
}

class FormikChangeProfile extends Formik<{}, IFormikChangeProfileValues> {}

import api from 'src/routes/api';

interface IProps {
    lang?: string;
    account: IAccount;
    loaders?: {
        changeProfile: boolean;
    };
}

interface IActions {
    actions: {
        changeProfile: (params: IChangeProfileRequestParams) => void;
        updateAccount: (params: IGetAccountsRequestParams) => void;
    };
}

import css from 'src/components/Overlay/Overlay.css';

class ChangeProfile extends React.PureComponent<IProps & IActions, any> {
    onSubmit = async (params: IFormikChangeProfileValues) => {
        const { account } = this.props;

        await this.props.actions.changeProfile({
            userId: account.id,
            firstName: params.firstName,
            lastName: params.lastName,
            reason: params.reason
        });

        await this.props.actions.updateAccount({ contact: account.id });
    };

    render() {
        const { account, loaders, lang } = this.props;

        return (
            <FormikChangeProfile
                initialValues={{
                    firstName: account.firstName,
                    lastName: account.lastName,
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                validationSchema={yup.object().shape({
                    firstName: yup.string().required('Необходимо указать имя'),
                    lastName: yup.string().required('Необходимо указать фамилию')
                })}
                onSubmit={this.onSubmit}
                render={({ values, errors, setFieldValue, handleSubmit }) => (<>
                    <Form locator="change-profile" className={`${css.container} pl-l pt-xl`}>
                        <div className="font-size-large mb-m">Изменить профиль</div>
                        <div className="col-6">
                            <Row>
                                <Field>
                                    <Input
                                        locator="input-name"
                                        status={errors.firstName ? 'error' : null}
                                        hint={errors.firstName && String(errors.firstName)}
                                        label="Имя"
                                        value={values.firstName}
                                        theme="light"
                                        onChange={(value: string) => {
                                            setFieldValue('firstName', value);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="last-name"
                                        status={errors.lastName ? 'error' : null}
                                        hint={errors.lastName && String(errors.lastName)}
                                        label="Фамилия"
                                        value={values.lastName}
                                        theme="light"
                                        onChange={(value: string) => {
                                            setFieldValue('lastName', value);
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
                            locator="button-change-profile"
                            isLoading={loaders.changeProfile}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Изменить
                        </Button>
                        <div className={css.errorContainer}>
                            <Error className={css.error} route={api.auth.changeProfile} />
                            <RequestStatus
                                className="ml-s"
                                render={(request: IRequest) => `
                                    Контактные данные изменены на ${request.data.firstName} ${request.data.lastName}
                                `}
                                route={api.auth.changeProfile}
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
        changeProfile,
        updateAccount
    }, dispatch)
});

const ChangeProfileWithConnect = connect(mapStateToProps, mapDispatchToProps)(ChangeProfile);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.auth.changeProfile
    ]}>
        <ChangeProfileWithConnect {...props} />
    </RequestTracker>
);
