import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { ILootBox, ILootBoxComponent } from 'src/entities/LootBoxes/models/LootBox';
import { IImagesGroups } from 'src/entities/ImagesGroups/store';
import { IStore } from 'src/store';

export interface IProps {
    lang: string;
    className?: string;
    lootBox: ILootBox;
    imagesGroups: IImagesGroups;
    onClick: (lootBox: ILootBox) => void;
}

interface IState {
    mainPrize: ILootBoxComponent;
    mainPrizeImageSrc: string;
}

import css from './LootBoxWidget.css';

class LootBoxWidget extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const { imagesGroups } = props;
        const mainPrize = props.lootBox.components.find((component: ILootBoxComponent) =>
            component.isMainPrize
        );

        if (mainPrize) {
            const mainPrizeImageSrc = imagesGroups.products.launcherProduct.replace('{id}', String(mainPrize.id));

            this.state = {
                mainPrize,
                mainPrizeImageSrc
            };
        } else {
            this.state = {
                mainPrize: null,
                mainPrizeImageSrc: null
            };
        }
    }

    onClick = () => {
        this.props.onClick(this.props.lootBox);
    };

    render() {
        const { className, lootBox, lang } = this.props;
        const { mainPrizeImageSrc } = this.state;
        const { withdrawn: isInvisible } = lootBox;

        return (
            <div onClick={this.onClick} className={classNames(
                'col-4',
                'col',
                'justify-content-space-between',
                'text-align-center',
                className,
                css.container,
                isInvisible && css.invisible
            )}>
                <div>
                    {mainPrizeImageSrc ? (
                        <img
                            src={mainPrizeImageSrc}
                            className={css.image}
                        />
                    ) : (
                        <div className={css.image} />
                    )}
                    <div style={{ WebkitBoxOrient: 'vertical' }} className={`
                        ${css.name}
                        font-size-big
                        mb-s
                        mt-s
                    `}>
                        {lootBox.name[lang]}
                    </div>
                </div>
                <div className={css.visibility}>
                    {isInvisible
                        ? 'Не видимо игрокам'
                        : 'Видно игрокам'
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    lang: state.area.selected.lang,
    imagesGroups: state.imagesGroups
});

export default connect(mapStateToProps)(LootBoxWidget);
