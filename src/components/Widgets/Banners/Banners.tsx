import React from 'react';

import Banner, { Wrapper, Category, Title } from 'ui/lib/Banner';
import { IWidgetCollection, IWidgetBanner } from 'src/entities/Content/store';

export interface IProps {
    widget: IWidgetCollection;
    onClick: (widget: IWidgetCollection) => void;
}

import css from './Banners.css';

export default class BannerComponent extends React.PureComponent<IProps, any> {
    onClick = () => {
        this.props.onClick(this.props.widget);
    }

    render() {
        const { widget } = this.props;

        return (
            <Banner
                className={css.container}
                autoSlide={false}
                easingType="easingLinear"
                onClick={this.onClick}
                onControlClick={() => {}}
            >
                {widget.widgets.map((widgetItem: IWidgetBanner) => (
                    <Wrapper
                        imageUrl={widgetItem.source.imageUrl}
                        source={widgetItem}
                        key={widgetItem.id}
                        onClick={this.onClick}
                    >
                        {widgetItem.source.label && <Category>{widgetItem.source.label.ru}</Category>}
                        {widgetItem.source.title && <Title>{widgetItem.source.title.ru}</Title>}
                    </Wrapper>
                ))}
            </Banner>
        );
    }
}
