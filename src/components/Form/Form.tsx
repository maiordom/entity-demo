import React from 'react';
import classnames from 'classnames';
import reduce from 'lodash/reduce';
import isBoolean from 'lodash/isBoolean';

export { Error } from './Error';
export { Errors } from './Errors';

import css from './Form.css';

type TProps = {
    className?: string;
    children?: any;
    locator?: string;
};

const transformPropsToClassNames = (props) =>
    reduce(props, (result, prop, key) => {
        if (isBoolean(prop)) {
            result.push(css[key]);
        }

        return result;
    }, []);

export const Form = (props: TProps) => (
    <form data-locator={`${props.locator}-form`} className={classnames(css.form, props.className, transformPropsToClassNames(props))}>{props.children}</form>
);

export const SimpleError = ({ className, children, locator }: TProps) => (
    <div data-locator={`${locator}-error`} className={classnames(css.errorSimple, className)}>{children}</div>
);

export const Row = (props: TProps & {
    col?: boolean
}) => (
    <div className={classnames(css.row, props.className, transformPropsToClassNames(props))}>{props.children}</div>
);

export const Inline = ({ className, children, locator }: TProps) => (
    <div data-locator={locator} className={classnames(css.inline, className)}>{children}</div>
);

export const Field = ({ className, children, locator }: TProps) => (
    <div data-locator={locator} className={classnames(className, css.field)}>{children}</div>
);

export const Label = ({ className, children, locator }: TProps) => (
    <div data-locator={locator} className={classnames(className, css.label)}>{children}</div>
);
