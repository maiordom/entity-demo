import React from 'react';
import classNames from 'classnames';

export interface IField {
    text: string;
    rowControls?: (value: string | number | null) => React.ReactNode;
    field?: string;
    hideKeys?: boolean;
    fields?: Array<string>;
    collapsible?: boolean;
    getValue?: (item) => string | object;
    renderCell?: (item, value) => JSX.Element;
    format?: string;
    cellStyle?: { [key: string]: string; };
    style?: {
        [key: string]: string;
    };
}

export type IItem = { [key: string]: string | number; }

export interface IProps {
    orientation?: string;
    onRawClick?: (item) => void;
    data: Array<IItem>;
    locator?: string;
    columns?: Array<IField>;
    rows?: Array<IField>;
    className?: string;
    rowControls?: (item) => React.ReactNode;
}

import Header from './Header';
import Row from './Row';
import VerticalRow from './VerticalRow';

import css from './Table.css';

const Body = ({ data, ...props }: IProps) => (
    <tbody>
        {data.map((item, index) => (
            <Row
                key={index}
                {...props}
                item={item}
                data={data}
            />
        ))}
    </tbody>
);

const VerticalBody = ({ rows, ...props }: IProps) => (
    <tbody>
        {rows.map((row, index) => (
            <VerticalRow
                key={index}
                {...props}
                row={row}
            />
        ))}
    </tbody>
);

export default class Table extends React.PureComponent<IProps, any> {
    static defaultProps = {
        orientation: 'horizontal',
        onRawClick: () => {}
    };

    render() {
        const {
            orientation,
            columns,
            rows,
            locator,
            data,
            className,
            onRawClick,
            rowControls
        } = this.props;

        return (
            <table
                data-locator={`${locator}-table`}
                className={classNames(
                    css.table,
                    className
                )}
                cellSpacing="0"
            >
                {orientation === 'horizontal' && (
                    <Header
                        locator={locator}
                        rowControls={rowControls}
                        columns={columns}
                        data={data}
                    />
                )}
                {orientation === 'horizontal'
                    ? <Body
                        rowControls={rowControls}
                        columns={columns}
                        data={data}
                        onRawClick={onRawClick}
                    />
                    : <VerticalBody
                        rows={rows}
                        rowControls={rowControls}
                        data={data}
                        onRawClick={onRawClick}
                    />
                }
            </table>
        );
    }
}
