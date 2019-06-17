import React from 'react';
import moment from 'moment';
import classnames from 'classnames';

import { plural } from 'src/utils/Plural';
import {
    DATE_PERMANENT_BAN,
    DATE_SHORT_FORMAT,
    DATE_LONG_FORMAT
} from 'src/constants';

export interface IBan {
    userId: number;
    date: string;
    until: string;
    reason: {
        internal: string;
        external: string;
    };
}

import css from './Event.css';

interface IProps {
    children?: string;
    className?: string;
}

export const Container = ({
    children,
    className
}: {
    children: Array<JSX.Element>;
    className: string;
}) => (
    <div className={classnames(css.container, className)}>
        {children}
    </div>
);

export const Date = ({ children, className }: IProps) => (
    <div className={classnames(css.date, className)}>
        {moment(children).format(DATE_LONG_FORMAT)}
    </div>
);

export const User = ({ children }: IProps) => (
    <div className={css.user}>{children}</div>
);

export const Delimiter = () => (
    <div className={css.delimiter}>//</div>
);

export const Context = ({ children, className }: IProps) => (
    <div className={classnames(css.context, className)}>
        <pre>{children}</pre>
    </div>
);

export const BanUntil = ({
    children,
    className,
    days
}: {
    days: number;
} & IProps) => {
    const isPermanent = moment(children).format(DATE_SHORT_FORMAT) === DATE_PERMANENT_BAN;

    return (
        <div className={classnames(css.banUntil, className)}>
            <span className={css.banTitle}>Забанен </span>
            <span className={css.banDate}>до {moment(children).format(DATE_SHORT_FORMAT)}</span>
            {isPermanent
                ? <span> (перманентный)</span>
                : <span> (на {days} {plural(days, ['день', 'дня', 'дней'])})</span>
            }
        </div>
    );
};

export const Name = ({ children, className }: IProps) => (
    <div className={classnames(css.name, className)}>
        {children}
    </div>
);

export const Reason = ({
    title,
    description,
    className
}: {
    title: string;
    description: string;
} & IProps) => (
    <div className={className}>
        <div className={css.reasonTitle}>{title}</div>
        <div className={css.reasonDescription}>{description}</div>
    </div>
);
