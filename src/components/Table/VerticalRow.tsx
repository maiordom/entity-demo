import React from 'react';
import classNames from 'classnames';
import get from 'lodash/get';

import { IProps, IField } from './Table';

import css from './Table.css';

export default class VerticalRow extends React.PureComponent<IProps & { row?: IField; }, any> {
    get value() {
        const {
            data,
            row,
        } = this.props;

        let value: string | object = '';
        let rawValue = '';
        
        if (row.getValue) {
            value = row.getValue(data);
            rawValue = '';
        } else {
            value = get(data, row.field);
            rawValue = String(value);

            if (row.fields) {
                value = row.fields.reduce((values, field) => {
                    values.push(get(data, field));
                    return values;
                }, []).join(' ');
                rawValue = value;
            }

            if (typeof value !== 'undefined' && value !== null) {
                value = String(value);
            }
        }

        if (value === undefined || value === null) {
            value = <span className={css.null}>—</span>;
        }

        return {
            rawValue,
            value
        };
    }

    render() {
        const { row } = this.props;
        const { rawValue, value } = this.value;

        const rowControls = row.rowControls && row.rowControls(rawValue);

        return (
            <tr className={css.row} key={`tr-${row.field}`}>
                <td className={css.cell}>
                    <span title={row.text}>{row.text}</span>
                </td>
                <td className={css.cell}>
                    <span title={String(rawValue)}>{value}</span>
                </td>
                <td className={classNames(
                    css.cell,
                    css.control
                )}>
                    {rowControls || <span>&nbsp;</span>}
                </td>
            </tr>
        );
    }
}
