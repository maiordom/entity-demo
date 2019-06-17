import React from 'react';

import ProductCard from 'ui/lib/ProductCard';
import { IWidgetProduct } from 'src/entities/Content/store';
import { IAreaItem } from 'src/entities/Area/store';

export interface IProps {
    area: IAreaItem;
    widget: IWidgetProduct;
    onClick: (widget: IWidgetProduct) => void;
}

import css from './Widgets.css';

export default class ProductCardWidget extends React.PureComponent<IProps, any> {
    onClick = () => {
        this.props.onClick(this.props.widget);
    }

    render() {
        const { widget, area } = this.props;

        if (widget.status === 'error') {
            return (
                <div className={`
                    ${css.simpleCard}
                    ${css.inactiveCard}
                `}>
                    <span className="pl-s pr-s">{widget.statusText}</span>
                </div>
            );
        }

        return (
            <div className={css.container}>
                <ProductCard
                    serviceId={widget.serviceId}
                    theme="light"
                    id={widget.source.id}
                    price={widget.source.price}
                    imgUrl={widget.source.previewImageUrl}
                    referencePrice={widget.source.referencePrice}
                    title={widget.source.name[area.lang]}
                    onClick={this.onClick}
                />
            </div>
        );
    }
}
