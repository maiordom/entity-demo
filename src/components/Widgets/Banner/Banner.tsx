import React from 'react';

import Banner, { Wrapper, Category, TitleSimple } from 'ui/lib/Banner';
import { IWidgetBanner } from 'src/entities/Content/store';

export interface IProps {
    area: string;
    widget: IWidgetBanner;
    onClick: (widget: IWidgetBanner) => void;
}

import css from './Banner.css';

export default class BannerComponent extends React.PureComponent<IProps, any> {
    onClick = () => {
        this.props.onClick(this.props.widget);
    }

    render() {
        const { widget, area } = this.props;

        return (
            <Banner className={css.container}>
                <Wrapper
                    imageUrl={widget.source.imageUrl}
                    onClick={this.onClick}
                    source={widget}
                >
                    {widget.source.label[area] && <Category>{widget.source.label[area]}</Category>}
                    {widget.source.title[area] && <TitleSimple>{widget.source.title[area]}</TitleSimple>}
                </Wrapper>
            </Banner>
        );
    }
}
