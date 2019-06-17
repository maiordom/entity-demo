import React from 'react';

import Button from 'ui/lib/Button';

import { IGameAccount } from 'src/entities/GameAuth/store';

export interface IProps {
    data: IGameAccount;
    onBanManagerClick: (data: IGameAccount) => void;
    onSubscribeManagerClick: (data: IGameAccount) => void;
}

export default class GameAccountTableControls extends React.PureComponent<IProps, any> {
    onBanManagerClick = () => {
        this.props.onBanManagerClick(this.props.data);
    };

    onSubscribeManagerClick = () => {
        this.props.onSubscribeManagerClick(this.props.data);
    };

    render() {
        return (
            <div className="inline">
                <Button
                    className="col-3"
                    onClick={this.onBanManagerClick}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Блокировка
                </Button>
                <Button
                    className="col-2 ml-s"
                    onClick={this.onSubscribeManagerClick}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Подписка
                </Button>

            </div>
        );
    }
}
