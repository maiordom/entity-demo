import React from 'react';

import Radio from 'ui/lib/Radio';

import { IAccount } from 'src/entities/Accounts/models/Account';
import AccountBan from './AccountBan';
import AccountUnban from './AccountUnban';
import AccountBanEvents from './AccountBanEvents';

interface IProps {
    account: IAccount;
}

interface IState {
    selected: string;
}

import css from 'src/components/Overlay/Overlay.css';

export default class AccountBanManager extends React.PureComponent<IProps, IState> {
    state = {
        selected: this.props.account.ban.until ? 'unban' : 'ban'
    };

    onRadioChange = (selected: IState['selected']) => {
        this.setState({ selected });
    };

    render() {
        const { account } = this.props;
        const { selected } = this.state;
        let component = null;

        switch (selected) {
            case 'ban': component = <AccountBan account={account} />; break;
            case 'unban': component = <AccountUnban account={account} />; break;
        }

        return (
            <div className={`${css.container} pl-l pt-xl`}>
                <div className="inline mb-m">
                    <Radio
                        onChange={this.onRadioChange}
                        selected={selected === 'ban'}
                        theme="light"
                        text="Бан"
                        value="ban"
                    />
                    <Radio
                        onChange={this.onRadioChange}
                        selected={selected === 'unban'}
                        className="ml-s"
                        theme="light"
                        text="Разбан"
                        value="unban"
                    />
                </div>
                <div className="col-6 mb-xl">
                    {component}
                </div>
                <AccountBanEvents account={account} />
            </div>
        );
    }
}
