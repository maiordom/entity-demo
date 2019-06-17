import * as React from 'react';

import css from './TestButton.css';

export default class Test extends React.Component<any, any> {
    render() {
        return (
            <div className={css.container}>{this.props.children}</div>
        );
    }
}
