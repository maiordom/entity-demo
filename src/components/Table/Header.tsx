import React from 'react';

import { IProps } from './Table';

import css from './Table.css';

export default class Header extends React.PureComponent<IProps, any> {
    render() {
        const { columns, locator } = this.props;

        return (
            <thead data-locator={`${locator}-header`} className={css.thead}>
                <tr>
                    {columns.map((column) => {
                        if (!column.text) {
                            return null;
                        }

                        return (
                            <th key={`thead-${column.text}`} className={css.th}>{column.text}</th>
                        );
                    })}
                </tr>
            </thead>
        );
    }
}