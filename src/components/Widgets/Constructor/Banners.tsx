import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import classNames from 'classnames';

import { IWidgetCollection, IWidgetBanner } from 'src/entities/Content/store';

import Icon from 'ui/lib/Icon';

interface IProps {
    onBannerCreate: () => void;
    onBannerEdit?: (widget: IWidgetBanner) => void;
    widget: IWidgetCollection;
}

import css from './Banners.css';

export default class Banners extends React.PureComponent<IProps, any> {
    getWidgetConfig(): IWidgetCollection {
        let widget: IWidgetCollection = cloneDeep(this.props.widget);

        widget.display = 'carousel';

        return widget;
    }

    onControlClick = () => {
        this.props.onBannerCreate();
    };

    onBannerClick = (widget: IWidgetBanner) => {
        this.props.onBannerEdit && this.props.onBannerEdit(widget);
    };

    renderBanners() {
        const { widget } = this.props;
        const widgets = widget && widget.widgets;
        const hasBanners = widgets && widgets.length > 0;

        if (hasBanners) {
            return (
                <div className="mb-m">
                    {widgets.map(widget => (
                        <Banner
                            onClick={this.onBannerClick}
                            widget={widget as IWidgetBanner}
                        />
                    ))}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="col-6">
                {this.renderBanners()}
                <div className={classNames(css.add, css.banner)} onClick={this.onControlClick}>
                    <Icon
                        className={css.plus}
                        category="controls"
                        name="plus"
                    />
                </div>
            </div>
        );
    }
}

const Banner = ({
    widget,
    onClick
}: {
    widget: IWidgetBanner, 
    onClick: (widget: IWidgetBanner) => void;
}) => (
    <div className={css.banner} onClick={() => onClick(widget)}>
        <div
            className={css.image}
            style={{ backgroundImage: `url(${widget.source.imageUrl})` }}
        />
        <div className={css.title}>
            {widget.source.title.ru}
        </div>
    </div>
);
