import React from 'react';

import Icon from 'ui/lib/Icon';
import Spinner from 'ui/lib/Spinner';

import css from './LootBoxCreate.css';

interface IProps {
    isLoading: boolean;
    className: string;
    onClick: () => void;
}

export default class LootBoxCreate extends React.Component<IProps> {
    render() {
        const { className, isLoading } = this.props;

        return (
            <div
                onClick={this.props.onClick}
                className={`
                    ${css.container}
                    ${className}
                    col-4
                `}
            >
                <Icon className={css.plus} category="controls" name="plus" />
                <div className="mt-s mb-xxs">Добавить колесо</div>
                <div className="font-size-small">Перетяни сюда CSV</div>
                {isLoading && (
                    <Spinner
                        size="small"
                        className={css.spinner}
                    />
                )}
            </div>
        )
    }
}
