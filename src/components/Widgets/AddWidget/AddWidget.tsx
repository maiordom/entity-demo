import React from 'react';
import classNames from 'classnames';

import Icon from 'ui/lib/Icon';

import css from './AddWidget.css';

interface IProps {
    onClick: () => void;
}

export default class AddWidget extends React.PureComponent<IProps, any> {
    render() {
        return (
            <div onClick={this.props.onClick} className={classNames(css.container, 'col-4')}>
                <Icon className={css.plus} category="controls" name="plus" />
                <div className="mt-s">Добавить виджет</div>
            </div>
        );
    }
}
