import React, { PureComponent } from 'react';

import Icon from 'ui/lib/Icon';
import { Rub, RubGlyph } from 'ui/lib/Currency';

import { plural } from 'src/utils/Plural';

import { ILootBoxVersion } from 'src/entities/LootBoxes/models/LootBox';

export interface IProps {
    version: ILootBoxVersion;
    className?: string;
    onClick: (version: ILootBoxVersion) => void;
}

import css from './LootBoxVersion.css';

const quantity = [
    'оборот',
    'оборота',
    'оборотов'
];

export default class LootBoxVersion extends PureComponent<IProps> {
    onClick = () => {
        this.props.onClick(this.props.version);
    };

    render() {
        const { version, className } = this.props;

        return (
            <div
                onClick={this.onClick}
                className={`
                    ${css.container}
                    ${className}
                    ${version.isEnabled && css.active}
                `}
            >
                <Icon
                    name={version.isEnabled ? 'play' : 'pause'}
                    wrapperClassName="mr-xxs"
                    className={css.icon}
                />
                {version.price}<RubGlyph className={css.rub} />
                <div className={`${css.dot} ml-xxs mr-xxs`}>·</div>
                <div className={css.quantity}>
                    {version.quantity} {plural(version.quantity, quantity)}
                </div>
            </div>
        );
    }
}
