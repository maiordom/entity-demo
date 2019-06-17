import React from 'react';

import css from './WheelPrize.css';

interface IProps {
    src: string;
    name: string;
    isTransportable: string;
    quantity: number;
    textDescription: string;
}

export const WheelPrize = ({
    src,
    name,
    isTransportable,
    quantity,
    textDescription
}: IProps) => (
    <div className={css.container}>
        <img className={css.image} src={src} />
        <div className={css.name}>{name}</div>
        <div className={css.quantity}>{quantity} шт</div>
        {textDescription && (<>
            <div className={css.border} />
            <div className={css.textDescription}>{textDescription}</div>
        </>)}
        {isTransportable && (<>
            <div className={css.border} />
            <div>{isTransportable}</div>
        </>)}
    </div>
);

export default WheelPrize;
