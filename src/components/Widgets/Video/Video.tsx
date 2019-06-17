import React from 'react';

import { IWidgetVideo } from 'src/entities/Content/store';

import Video from 'ui/lib/Video';

export interface IProps {
    area: string;
    widget: IWidgetVideo;
    onClick: (widget: IWidgetVideo) => void;
}

import css from './Video.css';

export default class VideoComponent extends React.PureComponent<IProps, {}> {
    onClick = () => {
        this.props.onClick(this.props.widget);
    };

    render() {
        const { widget, area } = this.props;

        return (
            <div className={css.container} onClick={this.onClick}>
                <div className={css.blank} />
                <Video
                    link={widget.source.link}
                    preview={widget.source.imageUrl}
                    title={widget.source.text[area]}
                    source="youtube"
                />
            </div>
        );
    }
}
