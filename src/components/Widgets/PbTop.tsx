import React, { PureComponent } from 'react';

import PbTop from 'ui/lib/PbTopWidget';

import { IWidgetPbTop } from 'src/entities/Content/store';

import css from './Widgets.css';

export interface IProps {
    widget: IWidgetPbTop;
    onClick: (widget: IWidgetPbTop) => void;
}

export default class PbTopWidget extends PureComponent<IProps> {
    widget = {
        division: null,
        rank: null,
        goal: {
            type: 'none'
        },
        stage: {
            current: 1,
            total: 5,
            until: '2019-03-04T00:00:00Z'
        },
        type: 'firstDay'
    };

    localization = {
        group: 'Твоя группа',
        groupDescription: 'Попади в число лучших игроков, сражайся за&nbsp;еженедельные призы и&nbsp;место в&nbsp;крутейшем подразделении<br />Point Blank!',
        league: 'Лига Героев',
        tooltip: 'Подсказочка',
        week: 'неделя'
    };

    onClick = () => {
        this.props.onClick(this.props.widget);
    };

    render() {
        const { widget, localization } = this;

        return (
            <div
                onClick={this.onClick}
                className={css.simpleCard}
            >
                <PbTop
                    localization={localization}
                    group={null}
                    theme="dark"
                    data={widget as any}
                />
            </div>
        );
    }
}
