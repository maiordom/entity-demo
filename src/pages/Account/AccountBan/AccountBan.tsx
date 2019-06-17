import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment, { Moment } from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import Checkbox from 'ui/lib/Checkbox';

import { IFormikValues, Reason } from 'src/components/Reason/Reason';

import { Row, Field, SimpleError } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import SingleDatePicker from 'src/components/Calendar/Calendar';

import { IStore } from 'src/store';
import { banAccount, IBanAccountRequestParams } from 'src/entities/Auth/actions';
import { IAccount } from 'src/entities/Accounts/models/Account';
import { updateAccountAction as updateAccount, IGetAccountsRequestParams } from 'src/entities/Accounts/actions';
import { DATE_SHORT_FORMAT, DATE_PERMANENT_BAN } from 'src/constants';

interface IFormikBanAccountValues extends IFormikValues {
    date?: string;
    isPermanentBan: boolean;
    dateTime?: string;
}

interface IActions {
    actions?: {
        banAccount: (params: IBanAccountRequestParams) => Promise<void>;
        updateAccount: (params: IGetAccountsRequestParams) => void;
    };
}

interface IProps {
    account: IAccount;
    lang?: string;
    loaders?: {
        banAccount: boolean;
    };
}

import api from 'src/routes/api';

class FormikBanAccount extends Formik<{}, IFormikBanAccountValues> {}

class AccountBan extends React.PureComponent<IProps & IActions, any> {
    onSubmit = async (params: IFormikBanAccountValues) => {
        const { account } = this.props;
        const { dateTime } = params;
        const time = dateTime && dateTime.split(':');
        const hours = time ? Number(time[0]) : '00';
        const minutes = time ? Number(time[1]) : '00';
        const { date } = params;

        await this.props.actions.banAccount({
            userId: account.id,
            until: moment(date + ` ${hours}:${minutes}`).utc().format(),
            reason: params.reason
        });

        this.props.actions.updateAccount({ contact: account.id });
    };

    render() {
        const { account, loaders, lang } = this.props;
        const { ban } = account;

        return (
            <FormikBanAccount
                initialValues={{
                    isPermanentBan: moment(ban.until).format(DATE_SHORT_FORMAT) === DATE_PERMANENT_BAN,
                    date: ban.until ? moment(ban.until).format(DATE_SHORT_FORMAT) : '',
                    dateTime: ban.until ? moment(ban.until).format('HH:mm') : '',
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                onSubmit={this.onSubmit}
                validationSchema={yup.object().shape({
                    date: yup.string().required('Необходимо указать дату бана'),
                    dateTime: yup.string().matches(/^\d{2}:\d{2}$/, {
                        message: 'Неверный формат времени',
                        excludeEmptyString: true
                    })
                })}
                render={({ touched, values, errors, setFieldValue, handleSubmit }) => (<>
                    <Row col>
                        <div className="label">Заблокировать до</div>
                        <Row className="mt-none">
                            <Field className="mr-s">
                                <SingleDatePicker
                                    date={values.date}
                                    placeholder="Укажите дату"
                                    onChange={(date: Moment) => {
                                        setFieldValue('isPermanentBan', date
                                            ? date.format(DATE_SHORT_FORMAT) === DATE_PERMANENT_BAN
                                            : false
                                        );
                                        setFieldValue('date', date && date.format(DATE_SHORT_FORMAT) || '');
                                    }}
                                    showClearDate
                                />
                            </Field>
                            <Field>
                                <Input
                                    theme="light"
                                    value={values.dateTime}
                                    placeholder="Время, н-р 10:20"
                                    onBlur={(time: string) => {
                                        setFieldValue('dateTime', time || '');
                                    }}
                                />
                            </Field>
                        </Row>
                    </Row>
                    <Row>
                        <Field>
                            <Checkbox
                                checked={values.isPermanentBan}
                                theme="light"
                                label="Перманентный бан"
                                onClick={(checked: boolean) => {
                                    if (checked) {
                                        setFieldValue('date', moment(DATE_PERMANENT_BAN).format(DATE_SHORT_FORMAT));
                                    } else {
                                        setFieldValue('date', '');
                                        setFieldValue('dateTime', '');
                                    }

                                    setFieldValue('isPermanentBan', checked);
                                }}
                            />
                        </Field>
                    </Row>
                    {touched.date && errors.date && (
                        <SimpleError className="text-align-left mt-s">{errors.date}</SimpleError>
                    )}
                    {touched.dateTime && errors.dateTime && (
                        <SimpleError className="text-align-left mt-s">{errors.dateTime}</SimpleError>
                    )}
                    <Reason
                        values={values}
                        setFieldValue={setFieldValue}
                    />
                    <div className="mt-m">
                        <Button
                            isLoading={loaders.banAccount}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Забанить
                        </Button>
                        <div className="mt-s">
                            <RequestStatus
                                errorConfig={{
                                    showDetails: true,
                                    className: 'text-align-left'
                                }}                            
                                routes={[ api.auth.banAccount ]}
                                render={() => 'Аккаунт успешно забанен'}
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
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        banAccount,
        updateAccount
    }, dispatch)
});

const AccountBanWithConnect = connect(mapStateToProps, mapDispatchToProps)(AccountBan);

export default (props: IProps) => (
    <RequestTracker loaders={[ api.auth.banAccount ]}>
        <AccountBanWithConnect {...props} />
    </RequestTracker>
);
