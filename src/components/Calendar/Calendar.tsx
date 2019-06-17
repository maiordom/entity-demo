import React from 'react';
import classNames from 'classnames';

import 'react-dates/lib/css/_datepicker.css';
import moment, { Moment } from 'moment';
import { SingleDatePicker } from 'react-dates';

import css from './Calendar.css';

moment.lang('ru');

interface IProps {
    className?: string;
    readOnly?: boolean;
    showClearDate?: boolean;
    date?: string;
    locator?: string;
    label?: string;
    placeholder?: string;
    openDirection?: string;
    onChange: (date: Moment) => void;
    isOutsideRange?: () => boolean;
}

interface IState {
    date: Moment;
    focused: boolean;
}

export default class Calendar extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const state: IState = {
            focused: false,
            date: null
        };

        const date = moment(this.props.date);

        if (date.isValid()) {
            state.date = date;
        }

        this.state = state;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.date && nextProps.date !== this.props.date) {
            const date = moment(nextProps.date);

            if (date.isValid()) {
                this.setState({ date });
            }
        }

        if (!nextProps.date && this.props.date) {
            this.setState({ date: null });
        }
    }

    render() {
        const {
            label,
            className,
            readOnly,
            locator,
            placeholder,
            showClearDate,
            openDirection = 'down',
            isOutsideRange
        } = this.props;

        const { date, focused } = this.state;

        return (
            <div
                data-locator={locator}
                className={classNames(
                    className,
                    css.container,
                    css[openDirection],
                    date && css.hasDate
                )}
            >
                {label && (
                    <div className="label">{label}</div>
                )}
                <SingleDatePicker
                    transitionDuration={0}
                    openDirection={openDirection}
                    placeholder={placeholder}
                    date={date}
                    onDateChange={(date: Moment) => {
                        this.setState({ date });
                        this.props.onChange(date);
                    }}
                    focused={focused}
                    onFocusChange={({ focused }) => {
                        this.setState({ focused });
                    }}
                    numberOfMonths={1}
                    hideKeyboardShortcutsPanel
                    noBorder
                    isOutsideRange={isOutsideRange}
                    showClearDate={showClearDate}
                    readOnly={readOnly}
                />
            </div>
        );
    }
}
