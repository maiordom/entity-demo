import React, { PureComponent } from 'react';

import ProductCard from 'ui/lib/ProductCard';
import { IWidgetTimer } from 'src/entities/Content/store';
import { IAreaItem } from 'src/entities/Area/store';

export interface IProps {
    area: IAreaItem;
    widget: IWidgetTimer;
    onClick: (widget: IWidgetTimer) => void;
}

const localization = {
    days: (count: number) => 'd',
    hours: (count: number) => 'h',
    minutes: (count: number) => 'm',
    seconds: (count: number) => 's',
    premiumRunsOut: 'premiumRunsOut',
    prolongate: 'prolongate',
    buy: 'buy'
};

export default class Timer extends PureComponent<IProps> {
    onClick = () => {
        this.props.onClick(this.props.widget);
    };

    render() {
        const { widget, area } = this.props;
        const { source } = widget;

        return (
            <div onClick={this.onClick}>
                <ProductCard
                    title={null}
                    serviceId={widget.serviceId}
                    price={null}
                    theme="light"
                    id={widget.id}
                    counter={{
                        finishDate: source.finishDate,
                        intervalSeconds: source.intervalSeconds,
                        intervalStartDate: source.intervalStartDate,
                        target: source.target,
                        text: source.text && source.text[area.lang],
                        data: source.data,
                        buttonText: source.buttonText && source.buttonText[area.lang],
                        serviceId: source.serviceId
                    }}
                    buttonText={source.buttonText && source.buttonText[area.lang]}
                    iconName='hourglass'
                    imgUrl={widget.imageUrl}
                    widgetId={widget.id}
                    contentKey=""
                    localization={localization}
                />
            </div>
        );
    }
}
