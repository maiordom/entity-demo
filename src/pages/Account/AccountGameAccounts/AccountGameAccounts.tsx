import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import Loader from 'ui/lib/Loader';

import { getGameAccounts } from 'src/entities/GameAuth/actions';

import Table from 'src/components/Table/Table';
import Overlay from 'src/components/Overlay/Overlay';
import { Error } from 'src/components/Form/Form';

import { IGameAccounts, IGameAccount } from 'src/entities/GameAuth/store';
import { IStore } from 'src/store';
import GameAccountTableControls from './GameAccountTableControls';
import GameAccountBanManager from './GameAccountBanManager';
import GameAccountSubscriptionManager from './GameAccountSubscriptionManager';

import api from 'src/routes/api';

interface IProps {
    gameAccounts: IGameAccounts;
}

interface IState {
    loaders?: {
        getGameAccounts: boolean;
    };
}

interface IOwnProps {
    userId: string;
}

interface IActions {
    actions: {
        getGameAccounts: (userId: string) => Promise<void>;
    };
}

interface IState {
    currentAccount: IGameAccount;
}

class AccountGameAccounts extends React.PureComponent<IProps & IOwnProps & IActions, IState> {
    state = {
        currentAccount: null,
        loaders: { getGameAccounts: false }
    };

    overlayBanManagerRef: React.RefObject<Overlay> = React.createRef();
    overlaySubscriptionManagerRef: React.RefObject<Overlay> = React.createRef();

    componentDidMount() {
        const { userId } = this.props;

        this.setState({ loaders: { getGameAccounts: true } });

        setTimeout(async () => {
            await this.props.actions.getGameAccounts(userId);
            this.setState({ loaders: { getGameAccounts: false } });
        }, 0);
    }

    onBanManagerClick = (account: IGameAccount) => {
        this.setState({ currentAccount: account });
        this.overlayBanManagerRef.current.toggleVisibility(true);
    };

    onSubscribeManagerClick = (account: IGameAccount) => {
        this.setState({ currentAccount: account });
        this.overlaySubscriptionManagerRef.current.toggleVisibility(true);
    };

    renderRowControls = (account: IGameAccount) =>
        <GameAccountTableControls
            data={account}
            onBanManagerClick={this.onBanManagerClick}
            onSubscribeManagerClick={this.onSubscribeManagerClick}
        />;

    render() {
        const { gameAccounts, userId } = this.props;
        const { loaders, currentAccount } = this.state;
        const hasGameAccounts = gameAccounts && gameAccounts.length > 0;

        return (<>
            {loaders.getGameAccounts && (
                <div className="mb-m inline-flex align-items-center">
                    Загрузка игровых аккаунтов
                    <Loader size="small" className="ml-s inline" />
                </div>
            )}
            {hasGameAccounts && (
                <Table
                    data={gameAccounts as any}
                    rowControls={this.renderRowControls}
                    columns={[
                        { text: 'ID', field: 'id' },
                        { text: 'Сервис', field: 'partnerId' },
                        { text: 'Логин', field: 'login' },
                        { text: 'Регистрация', field: 'created' },
                        { text: 'Последний вход', field: 'lastLoginTime' },
                        { text: 'Подписка до', field: 'subscriptionUntil' },
                        { text: 'Статус', getValue: (account: IGameAccount) =>
                            account.ban.isPermanent
                                ? 'Перманентный'
                                : account.ban.until
                                    ? `Бан до ${moment(account.ban.until).utc().format('YYYY-MM-DD HH:mm')}`
                                    : 'Активен'
                        }
                    ]}
                />
            )}
            <Error showDetails className="text-align-left mt-m" route={
                api.gameAuth.getUserAccounts
            } />
            <Overlay ref={this.overlayBanManagerRef}>
                <GameAccountBanManager
                    userId={userId}
                    account={currentAccount}
                />
            </Overlay>
            <Overlay ref={this.overlaySubscriptionManagerRef}>
                <GameAccountSubscriptionManager
                    userId={userId}
                    account={currentAccount}
                />
            </Overlay>
        </>);
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps): IProps => ({
    gameAccounts: state.gameAuth[ownProps.userId]
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getGameAccounts
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountGameAccounts);
