import React from 'react';
import classNames from 'classnames';

import { IProps, IItem } from './Table';
import Cell from './Cell';

import css from './Table.css';

export default class Row extends React.PureComponent<IProps & { item?: IItem; }, any> {
    timestamp: number = 0;

    onMouseDown = () => {
        this.timestamp = (new Date).getTime();
    };

    onMouseUp = () => {
        const currentTime = (new Date).getTime();

        if (currentTime - this.timestamp < 100) {
            this.props.onRawClick(this.props.item);
        }
    };

    render() {
        const {
            item,
            columns,
            rowControls
        } = this.props;

        return (
            <tr
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                className={css.row}
            >
                {columns.map((column, index) => (
                    <Cell
                        key={index}
                        item={item}
                        index={index}
                        column={column}
                    />
                ))}
                {rowControls && (
                    <td className={classNames(
                        css.cell,
                        css.control
                    )}>
                        {rowControls(item)}
                    </td>
                )}
            </tr>
        );
    }
}
