import React, { Component } from 'react';
import get from 'lodash/get';
import interact from 'interactjs';

interface IProps<T> {
    data: Array<T & {
        id: number;
    }>;
    fields: Array<IField>;
    onRowClick?: (item: T) => void;
    onRowMove: (from: number, to: number) => void;
}

type TName = () => React.ReactElement<any>;

interface IField {
    name: string | TName;
    key?: string;
    styles?: { [key: string]: string | number; };
    getValue?: (item: any) => any;
}

import css from './LootBoxTable.css';

const root = document.querySelector('body');

class Head extends Component<{
    fields: Array<IField>;
}> {
    render() {
        const { fields } = this.props;

        return (
            <div className={`inline align-items-center mb-xs ${css.head}`}>
                {fields.map(field => (
                    <div
                        className={css.cell}
                        style={field.styles}
                    >
                        {typeof field.name === 'function'
                            ? field.name()
                            : field.name
                        }
                    </div>
                ))}
            </div>
        )
    }
}

class Row<T> extends Component<{
    fields: Array<IField>;
    data: T & {
        id: number;
    };
    onClick: (data: T) => void;
}> {
    onClick = () => {
        this.props.onClick(this.props.data);
    };

    render() {
        const { fields, data } = this.props;

        return (
            <div
                data-id={data.id}
                onClick={this.onClick}
                className={`inline align-items-center ${css.row}`}
            >
                {fields.map(field => (
                    <div
                        className={css.cell}
                        style={field.styles}
                    >
                    {field.getValue
                        ? field.getValue(data)
                        : get(data, field.key)
                    }
                    </div>
                ))}
            </div>
        );
    }
}

export default class LootBoxTable<T> extends Component<IProps<T>> {
    dragEndTimeout: number = 0;

    dragMoveListener (event) {
        const { target } = event;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    onRowClick = (data: T) => {
        if ((new Date()).getTime() - this.dragEndTimeout < 1000) {
            return;
        }

        this.props.onRowClick(data);
    };

    componentDidMount() {
        interact(`.${css.row}`).draggable({
            inertia: true,
            autoScroll: true,
            onmove: this.dragMoveListener,

            onstart: (event) => {
                root.classList.add('pointer-events-none');
                event.target.classList.add(css.dragActive);
            },

            onend: (event) => {
                const { target } = event;

                root.classList.remove('pointer-events-none');

                event.target.classList.remove(css.dragActive);
                target.style.transform = 'translate(0px, 0px)';
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);
                this.dragEndTimeout = (new Date()).getTime();
            }
        }).styleCursor(false);

        interact(`.${css.row}`).dropzone({
            accept: `.${css.row}`,
            overlap: 'pointer',

            ondragenter: (event) => {
                event.target.classList.add(css.activeDropzone);
            },

            ondragleave: (event) => {
                event.target.classList.remove(css.activeDropzone);
            },

            ondrop: (event: any) => {
                const dropzone = event.target;
                const { id: to } = dropzone.dataset;
                const { id: from } = event.dragEvent.currentTarget.dataset;

                this.props.onRowMove(Number(from), Number(to));
            },

            ondropdeactivate: (event) => {
                event.target.classList.remove(css.activeDropzone);
            }
        });
    }

    render() {
        const { data, fields } = this.props;

        return (
            <div className={`col`}>
                <Head
                    fields={fields}                
                />
                <div className={css.wrapper}>
                    {data.map(item => (
                        <Row
                            onClick={this.onRowClick}
                            data={item}
                            fields={fields}
                        />
                    ))}
                </div>
            </div>
        );
    }
}