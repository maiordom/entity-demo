import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment, { Moment } from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Row, Field, Error, SimpleError } from 'src/components/Form/Form';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import Checkbox from 'ui/lib/Checkbox';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { IGameAccount } from 'src/entities/GameAuth/store';
import SingleDatePicker from 'src/components/Calendar/Calendar';
import { banGameAccount, IBanGameAccountRequestParams } from 'src/entities/GameAuth/actions';
import { setGameAccountBan, ISetGameAccountBanParams } from 'src/entities/GameAuth/actions';
import { DATE_SHORT_FORMAT, DATE_PERMANENT_BAN } from 'src/constants';
import { IFormikValues, Reason } from 'src/components/Reason/Reason';
import { IStore } from 'src/store';

class FormikGameAccountBan extends Formik<{}, IFormikGameAccountBanValues> {}

interface IFormikGameAccountBanValues extends IFormikValues {
    isPermanentBan: boolean;
    date?: string;
    dateTime?: string;
}

interface IActions {
    actions?: {
        banGameAccount: (params: IBanGameAccountRequestParams) => Promise<void>;
        setGameAccountBan: (params: ISetGameAccountBanParams) => void;
    };
}

interface IProps {
    lang?: string;
    userId: string;
    account: IGameAccount;
    loaders?: {
        banGameAccount: boolean;
    };
}

import api from 'src/routes/api';

import css from 'src/components/Overlay/Overlay.css';

class GameAccountBan extends React.PureComponent<IProps & IActions, any> {
    onSubmit = (params: IFormikGameAccountBanValues) => {
        const { account, userId } = this.props;
        const { dateTime } = params;
        const time = dateTime && dateTime.split(':');
        const hours = time ? Number(time[0]) : '00';
        const minutes = time ? Number(time[1]) : '00';
        const { date } = params;

        const ban = {
            date: moment(date + ` ${hours}:${minutes}`).utc().format(),
            reason: params.reason
        };

        this.props.actions.banGameAccount({
            login: account.login,
            toPartnerId: account.partnerId,
            ...ban
        }).then(() => {
            this.props.actions.setGameAccountBan({
                userId,
                accountId: account.id,
                ban: {
                    until: ban.date,
                    reason: ban.reason
                }
            });
        });
    };

    render() {
        const { account, loaders, lang } = this.props;
        const { ban } = account;

        return (
            <FormikGameAccountBan
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
                    <Row>
                        <Field>
                            <Input
                                disabled
                                label="Логин"
                                theme="light"
                                value={account.login}
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
                                    date={values.date}
                                    openDirection="up"
                                    placeholder="Укажите дату"
                                    onChange={(date: Moment) => {
                                        setFieldValue('date', date && date.format(DATE_SHORT_FORMAT) || '');
                                        setFieldValue('isPermanentBan', date
                                            ? date.format(DATE_SHORT_FORMAT) === DATE_PERMANENT_BAN
                                            : false
                                        );
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
                        <SimpleError
                            className="text-align-left mt-s"
                        >
                            {errors.date}
                        </SimpleError>
                    )}
                    {touched.dateTime && errors.dateTime && (
                        <SimpleError
                            className="text-align-left mt-s"
                        >
                            {errors.dateTime}
                        </SimpleError>
                    )}
                    <div className={css.panel}>
                        <Button
                            isLoading={loaders.banGameAccount}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Забанить
                        </Button>
                        <div className={css.errorContainer}>
                            <Error
                                className={css.error}
                                route={api.gameAuth.banGameAccount}
                            />
                            <RequestStatus
                                className="ml-s"
                                route={api.gameAuth.banGameAccount}
                                render={() => 'Игровой аккаунт успешно забанен'}
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
        banGameAccount,
        setGameAccountBan
    }, dispatch)
});

const GameAccountBanWithConnect = connect(mapStateToProps, mapDispatchToProps)(GameAccountBan);

export default (props: IProps) => (
    <RequestTracker loaders={[ api.gameAuth.banGameAccount ]}>
        <GameAccountBanWithConnect {...props} />
    </RequestTracker>
);
