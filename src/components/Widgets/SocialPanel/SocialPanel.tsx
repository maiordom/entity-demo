import React from 'react';

import SocialPanel from 'ui/lib/SocialPanel';

import { IWidgetSocial } from 'src/entities/Content/store';

export interface IProps {
    widget: IWidgetSocial;
    onClick: (widget: IWidgetSocial) => void;
}

import css from './SocialPanel.css';

export default class SocialPanelComponent extends React.PureComponent<IProps, any> {
    onClick = () => {
        this.props.onClick(this.props.widget);
    };

    render() {
        const { widget } = this.props;

        return (
            <div className={css.container} onClick={this.onClick}>
                <div className={css.blank} />
                <SocialPanel items={widget.source as any} />
            </div>
        );
    }
}
