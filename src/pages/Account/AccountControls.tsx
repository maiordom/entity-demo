import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AxiosError } from 'axios';
import * as yup from 'yup';
import { Formik } from 'formik';
import get from 'lodash/get';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import Overlay from 'src/components/Overlay/Overlay';
import { Form, Row, Field } from 'src/components/Form/Form';

import { IAreaItem } from 'src/entities/Area/store';
import { IBalance } from 'src/entities/Billing/models/Balance';
import { IUserClaims } from 'src/entities/User/store';
import { setTestMoney, ISetTestMoneyParams } from 'src/entities/Billing/actions';
import { setTestAccount, ISetTestAccountParams } from 'src/entities/Billing/actions';
import { removeAccount, IRemoveAccountRequestParams, IRemoveAccountReason } from 'src/entities/Accounts/services/RemoveAccount';
import { getAccounts, IGetAccountsRequestParams, IGetAccountsResult } from 'src/entities/Accounts/actions';
import { openAccount, IOpenAccountParams } from 'src/entities/Accounts/actions';

import { IStore } from 'src/store';

import css from './AccountControls.css';
import overlayCSS from 'src/components/Overlay/Overlay.css';

export interface IOwnProps {
    id: string;
    className?: string;
}

export interface IProps {
    area: IAreaItem;
    claims: IUserClaims;
    balance?: IBalance;
}

export interface IActions {
    actions: {
        setTestAccount: (params: ISetTestAccountParams) => Promise<any>;
        setTestMoney: (params: ISetTestMoneyParams) => void;
        removeAccount: (params: IRemoveAccountRequestParams) => Promise<any>;
        getAccounts: (params: IGetAccountsRequestParams) => Promise<IGetAccountsResult>;
        openAccount: (params: IOpenAccountParams) => void;
    };
}

interface IState {
    testAccountError: string;
}

interface IRemoveAccountValues extends IRemoveAccountReason {}

class FormikRemoveAccount extends Formik<{}, IRemoveAccountValues> {}

class AccountControls extends React.PureComponent<IOwnProps & IProps & IActions, IState> {
    state = {
        testAccountError: ''
    };
    
    overlayRemoveAccountRef: React.RefObject<Overlay> = React.createRef();

    onRemoveAccountClick = () => {
        this.overlayRemoveAccountRef.current.toggleVisibility(true);
    };

    removeAccountHandler = async (values: IRemoveAccountValues) => {
        const { id } = this.props;

        this.overlayRemoveAccountRef.current.toggleVisibility();

        await this.props.actions.removeAccount({
            userId: this.props.id,
            reason: values
        });
        const { accounts: [ account ] } = await this.props.actions.getAccounts({ contact: id });

        if (account) {
            this.props.actions.openAccount({ account });
        }
    };

    onSetTestMoneyClick = () => {
        const { id: userId } = this.props;
        let amount;

        if (amount = prompt('Введите сумму начисления')) {
            this.props.actions.setTestMoney({
                userId,
                amount: Number(amount)
            });
        }
    }

    onSetTestAccountClick = () => {
        const { id: userId } = this.props;

        if (confirm('Сделать аккаунт тестовым?')) {
            this.props.actions.setTestAccount({ userId: Number(userId) })
                .catch(({ response: { data: { error } } }: AxiosError) => {
                    this.setState({ testAccountError: error.description });
                });
        }
    };

    render() {
        const { claims, area, className } = this.props;

        return (
            <div className={classNames("inline", className)}>
                {this.testMoneyButton}
                {claims[`auth.delete.users.forgame-${area.id}`] && (
                    <Button
                        className={css.button}
                        onClick={this.onRemoveAccountClick}
                        mods={['size-small', 'font-size-small']}
                        theme="danger"
                    >Удалить</Button>
                )}
                {this.deleteUserOverlay}
            </div>
        );
    }

    get testMoneyButton() {
        const { claims, area, balance } = this.props;
        const { testAccountError } = this.state;

        if (!balance || !claims[`billing.testaccount.write.forgame-${area.id}`]) {
            return null;
        }

        if (balance.isTest) {
            return (
                <Button
                    className={css.button}
                    locator="add-test-money"
                    onClick={this.onSetTestMoneyClick}
                    mods={['size-small', 'font-size-small']}
                    theme={'thin-black'}
                >Начислить тестовые деньги</Button>
            );
        }

        return balance.balance === 0 && (
            <div className={classNames(
                'position-relative',
                'inline',
                'align-items-flex-end',
                css.makeTest,
                css.button
            )}>
                <Button
                    locator="set-test-flag"
                    onClick={this.onSetTestAccountClick}
                    mods={['size-small', 'font-size-small']}
                    theme={'thin-black'}
                >Сделать тестовым</Button>
                {testAccountError && (
                    <span className={css.errorLabel}>{testAccountError}</span>
                )}
            </div>
        );
    }

    get deleteUserOverlay() {
        const { area } = this.props;
        const { lang } = area;
        
        return (
            <Overlay ref={this.overlayRemoveAccountRef}>
                <FormikRemoveAccount
                    initialValues={{
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }}
                    validationSchema={yup.object().shape({
                        internal: yup.string().required('Укажи внутреннюю причину'),
                        external: yup.object().shape({
                            [lang]: yup.string().required('Укажи внешнюю причину')
                        })
                    })}
                    onSubmit={this.removeAccountHandler}
                    render={({ values, errors, touched, setFieldValue, handleSubmit }) => (
                        <Form className={classNames(
                            overlayCSS.container,
                            'col-8',
                            'pl-m',
                            'pt-m',
                            'pr-m'
                        )}>
                            <div className="font-size-large mb-m">Удалить аккаунт</div>
                            <Row className="mt-s">
                                <Field>
                                    <Input
                                        status={touched.internal && errors.internal ? 'error' : null}
                                        hint={touched.internal && errors.internal as string}
                                        theme="light"
                                        label="Внутренняя причина"
                                        placeholder="Укажи внутреннюю причину"
                                        value={values.internal}
                                        onChange={(value: string) => {
                                            setFieldValue('internal', value);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row className="mt-s">
                                <Field>
                                    <Input
                                        status={
                                            get(touched, `external.${lang}`) &&
                                            get(errors, `external.${lang}`) ? 'error' : null
                                        }
                                        hint={
                                            get(touched, `external.${lang}`) &&
                                            get(errors, `external.${lang}`) as string
                                        }
                                        theme="light"
                                        label="Внешняя причина"
                                        placeholder={`Укажи причину для ${area.id} региона`}
                                        icon={area.id.toUpperCase()}
                                        iconCategory="flags"
                                        value={values.external[lang]}
                                        onChange={(value: string) => {
                                            setFieldValue(`external.${lang}`, value);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <div className={overlayCSS.panel}>
                                <Button
                                    onClick={(event: React.KeyboardEvent<HTMLButtonElement>) => {
                                        handleSubmit();
                                        event.preventDefault();
                                    }}
                                    type="submit"
                                    className={classNames('pl-s pr-s')}
                                    theme="danger"
                                    mods={['wide']}
                                >Удалить</Button>
                            </div>
                        </Form>
                    )}
                />
            </Overlay>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    claims: state.user.claims,
    area: state.area.selected,
    balance: state.accounts.selectedItem && state.billing.balance[state.accounts.selectedItem.id]
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        ...bindActionCreators({
            getAccounts,
            openAccount,
            setTestAccount,
            setTestMoney
        }, dispatch),
        removeAccount
    }
})

export default connect<IProps, IActions, IOwnProps>(mapStateToProps, mapDispatchToProps)(AccountControls);
