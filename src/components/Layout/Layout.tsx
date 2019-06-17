import React from 'react';
import classnames from 'classnames';
import reduce from 'lodash/reduce';
import isBoolean from 'lodash/isBoolean';

import css from './Layout.css';

const transformPropsToClassNames = (props) =>
    reduce(props, (result, prop, key) => {
        if (isBoolean(prop)) {
            result.push(css[key]);
        }

        return result;
    }, []);

type TProps = { className?: string, children: any, locator?: string, attributes?: { [key: string]: string | number; } };

export const Container = (props: TProps & { center?: boolean; hasVerticalScroll?: boolean; }) => (
    <div className={classnames(css.container, props.className, transformPropsToClassNames(props))}>
        {props.children}
    </div>
);

export const Scrollable = ({ children, className, locator }: TProps) => (
    <div data-locator={`${locator}`} className={classnames(css.scrollable, className)}>{children}</div>
);

export const GridCell = ({ children, className, attributes }: TProps) => (
    <div {...attributes} className={classnames(css.gridCell, className)}>{children}</div>
);

export const Inner = ({ children, className, locator }: TProps) => (
    <div data-locator={`${locator}`} className={classnames(css.inner, className)}>{children}</div>
);

export const Area = ({ children, className, locator }: TProps) => (
    <div data-locator={`${locator}`} className={classnames(css.area, className)}>{children}</div>
);

export const Page = ({ children, className, locator }: TProps) => (
    <div data-locator={`${locator}`} className={classnames(css.page, className)}>{children}</div>
);

export const SideBar = ({ children, className, locator }: TProps) => (
    <div data-locator={`${locator}`} className={classnames(css.sideBar, className)}>{children}</div>
);

export const Userbar = ({ children, className, locator }: TProps) => (
    <div data-locator={`${locator}`} className={classnames(css.userbar, className)}>{children}</div>
);

export const Title = ({ children, className, locator }: TProps) => (
    <div data-locator={`${locator}`} className={classnames(css.title, className)}>{children}</div>
);
