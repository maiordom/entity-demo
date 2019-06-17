import React from 'react';

import News, { NewsItem } from 'ui/lib/News/News';

import { IWidgetNews } from 'src/entities/Content/store';
import { IImagesGroups } from 'src/entities/ImagesGroups/store';

export interface IProps {
    widget: IWidgetNews;
    imagesGroups: IImagesGroups;
    onClick: (widget: IWidgetNews) => void;
}

import css from './Widgets.css';

export default class NewsWidget extends React.PureComponent<IProps, any> {
    onWidgetClick = () => {
        this.props.onClick(this.props.widget);
    };

    render() {
        const { widget, imagesGroups } = this.props;
        const imagesGroup = imagesGroups.news.desktop;

        if (widget.status === 'error') {
            return (
                <div className={`
                    ${css.simpleCard}
                    ${css.wideShadow}
                    ${css.inactiveCard}
                `}>
                    <span className="pl-s pr-s">{widget.statusText}</span>
                </div>
            );
        }

        return (
            <div
                onClick={this.onWidgetClick}
                className="height-100"
            >
                <News
                    theme="light"
                    className="pointer-events-none"
                >
                    {widget.news.map(newsArticle => (
                        <NewsItem
                            title={newsArticle.title}
                            lead={newsArticle.lead}
                            preview={imagesGroup.replace('{id}', newsArticle.imageId)}
                            date={newsArticle.whenPublished}
                            sourceData={newsArticle.sourceData as any}
                        />
                    ))}
                </News>
            </div>
        )
    }
}
