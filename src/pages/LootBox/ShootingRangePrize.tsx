import React from 'react';

import css from './ShootingRangePrize.css';

export const ShootingRangePrize = ({
    src,
    title,
    lifetime,
    priceDescription
}) => (
    <div className={css.container}>
        {(title || !title && lifetime) && (
            <div className={css.title}>{title || lifetime}</div>
        )}
        {title && lifetime && (
            <div className={css.lifetime}>{lifetime}</div>
        )}
        <div className={css.imageWrapper}>
            <img
                src={src}
                className={css.image}
            />
        </div>
        <div className={css.priceDescription}>{priceDescription}</div>
    </div>
);

export default ShootingRangePrize;
