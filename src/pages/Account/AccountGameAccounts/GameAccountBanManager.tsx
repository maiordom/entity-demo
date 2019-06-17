import React from 'react';

import Radio from 'ui/lib/Radio';

import { IGameAccount } from 'src/entities/GameAuth/store';
import GameAccountBan from './GameAccountBan';
import GameAccountUnban from './GameAccountUnban';

interface IProps {
    account: IGameAccount;
    userId: string;
}

interface IState {
    selected: 'ban' | 'unban';
}

import css from 'src/components/Overlay/Overlay.css';

export default class GameAccountBanManager extends React.PureComponent<IProps, IState> {
    state = {
        selected: 'ban'
    } as IState;

    onRadioChange = (selected: IState['selected']) => {
        this.setState({ selected });
    };

    render() {
        const { account, userId } = this.props;
        const { selected } = this.state;
        let component = null;

        switch (selected) {
            case 'ban': component = <GameAccountBan
                userId={userId}
                account={account}
            />; break;

            case 'unban': component = <GameAccountUnban
                userId={userId}
                account={account}
            />; break;
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
                <div className="col-6">
                    {component}
                </div>
            </div>
        );
    }
}
