import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IAccount } from 'src/entities/Accounts/models/Account';
import { getRegistrationContext, IGetRegistrationContextRequestParams } from 'src/entities/Auth/actions';
import { IRegistrationContext } from 'src/entities/Auth/models/RegistrationContext';
import { setAccountRegistrationContext, ISetAccountRegistrationContextParams } from 'src/entities/Accounts/actions';

import Icon from 'ui/lib/Icon';

import Table from 'src/components/Table/Table';
import Overlay from 'src/components/Overlay/Overlay';

import EmailReset from './EmailReset';
import DeletePhone from './DeletePhone';
import ChangeProfile from './ChangeProfile';
import AccountBanManager from 'src/pages/Account/AccountBan/AccountBanManager';

import css from './AccountInfo.css';

interface IProps {
    account: IAccount;
    isTest: boolean;
}

interface IActions {
    actions: {
        getRegistrationContext: (params: IGetRegistrationContextRequestParams) => Promise<IRegistrationContext>;
        setAccountRegistrationContext: (params: ISetAccountRegistrationContextParams) => void;
    };
}

export class AccountInfo extends React.PureComponent<IProps & IActions, any> {
    overlayEmailResetRef: React.RefObject<Overlay> = React.createRef();
    overlayDeletePhoneRef: React.RefObject<Overlay> = React.createRef();
    overlayChangeProfileRef: React.RefObject<Overlay> = React.createRef();
    overlayBanManagerRef: React.RefObject<Overlay> = React.createRef();

    async componentDidMount() {
        const { account } = this.props;
        const { id: userId } = account;

        const registrationContext = await this.props.actions.getRegistrationContext({ userId });

        this.props.actions.setAccountRegistrationContext({
            account,
            registrationContext
        });
    }

    onEmailResetClick = () => {
        this.overlayEmailResetRef.current.toggleVisibility(true);
    };

    onDeletePhoneClick = () => {
        this.overlayDeletePhoneRef.current.toggleVisibility(true);
    };

    onChageProfileClick = () => {
        this.overlayChangeProfileRef.current.toggleVisibility(true);
    };

    onBanClick = () => {
        this.overlayBanManagerRef.current.toggleVisibility(true);
    };

    render() {
        const { account, isTest } = this.props;

        return (<>
            <Overlay ref={this.overlayEmailResetRef}>
                <EmailReset account={account} />
            </Overlay>
            <Overlay ref={this.overlayDeletePhoneRef}>
                <DeletePhone account={account} />
            </Overlay>
            <Overlay ref={this.overlayChangeProfileRef}>
                <ChangeProfile account={account} />
            </Overlay>
            <Overlay ref={this.overlayBanManagerRef}>
                <AccountBanManager account={account} />
            </Overlay>
            <div className="font-size-large">
                Основная информация
            </div>
            <Table
                className="mt-s"
                orientation="vertical"
                data={account as any}
                rows={[
                    { text: 'ID', field: 'id', getValue: (row) => (<>
                        {row.id}
                        {isTest && <span data-locator="test-acc" className={classNames('ml-s', css.testAccount)}>Тестовый</span>}
                    </>)},
                    { text: 'Логин', field: 'username' },
                    { text: 'Имя Фамилия', fields: ['firstName', 'lastName'], rowControls: () =>
                        <Icon
                            locator="account-change-profile"
                            onClick={this.onChageProfileClick}
                            name="tool"
                            wrapperClassName="block button-icon"
                        />
                    },
                    { text: 'Почта', field: 'email', rowControls: (value) => value && value !== 'null' &&
                        <Icon
                            locator="account-change-mail"
                            onClick={this.onEmailResetClick}
                            name="tool"
                            wrapperClassName="block button-icon"
                        />
                    },
                    { text: 'Телефон', field: 'phone', rowControls: (value) => value && value !== 'null' &&
                        <Icon
                            locator="account-delete-phone"
                            onClick={this.onDeletePhoneClick}
                            name="cross"
                            wrapperClassName="block button-icon"
                        />
                    },
                    { text: 'Бан', field: 'ban.until', getValue: (row) => (
                        row.ban.isPermanent
                            ? 'Перманентный'
                            : row.ban.until
                    ), rowControls: () =>
                        <Icon
                            locator="account-ban"
                            onClick={this.onBanClick}
                            name="tool"
                            wrapperClassName="block button-icon"
                        />
                    },
                    { text: 'IP', field: 'registrationContext.ip' }
                ]}
            />
        </>)
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getRegistrationContext,
        setAccountRegistrationContext
    }, dispatch)
});

export default connect(null, mapDispatchToProps)(AccountInfo);
