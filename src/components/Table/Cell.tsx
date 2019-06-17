import React from 'react';
import get from 'lodash/get';
import map from 'lodash/map';
import classNames from 'classnames';

import css from './Table.css';

export default class Cell extends React.PureComponent<any, any> {
    state = {
        opened: !this.props.column.collapsible
    };

    onCollapse = (event) => {
        this.setState({ opened: !this.state.opened });
        event.stopPropagation();
    };

    render() {
        const { opened } = this.state;
        const { item, column } = this.props;

        const value = column.getValue
            ? column.getValue(item)
            : get(item, column.field);

        let valueElement = null;

        if (value === undefined || value === null) {
            valueElement = <span className={css.null}>—</span>;
        } else {
            valueElement = String(value);
        }

        if (column.renderCell) {
            valueElement = column.renderCell(item, valueElement);
        }

        return (
            value && value.constructor === Object
                ? <td
                    className={css.cell}
                    style={column.cellStyle}
                    key={`td-${column.field}-${JSON.stringify(value)}`}
                >
                    {column.collapsible && (
                        <span
                            className={css.link}
                            onClick={this.onCollapse}
                        >
                            {opened ? 'Свернуть' : 'Развернуть'}
                        </span>
                    )}
                    {opened && (
                        column.format === 'json'
                            ? <pre className={classNames(css.object, 'mt-none', 'pb-s')}>
                                {JSON.stringify(value, null, 2)}
                            </pre>
                            : map(value, (valueItem, key) =>
                                <div title={String(valueItem)} style={column.style}>
                                    {column.hideKeys
                                        ? valueItem
                                        : `${key}: ${valueItem}`
                                    }
                                </div>
                            )
                    )}
                </td>
                : <td
                    className={css.cell}
                    style={column.cellStyle}
                    key={`td-${column.field}-${value}`}
                >
                    <span title={String(value)} style={column.style}>{valueElement}</span>
                </td>
        );
    }
}
