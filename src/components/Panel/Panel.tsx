import React from 'react';

import css from './Panel.css';

interface IProps {
    children: any;
}

export default class Panel extends React.PureComponent<IProps, any> {
    render() {
        const { children } = this.props;

        return (
            <div className={css.container}>
                {children}
            </div>
        );
    }
}
