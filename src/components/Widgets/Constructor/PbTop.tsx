import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import { IWidgetPbTop } from 'src/entities/Content/store';
import { WIDGET_TYPE_PB_TOP } from './Constructor';

interface IProps {
    widget: IWidgetPbTop;
}

interface IState extends IWidgetPbTop {}

export default class Product extends React.PureComponent<IProps, IState> {
    state = cloneDeep(this.props.widget || {
        type: WIDGET_TYPE_PB_TOP,
        source: {}
    });

    getWidgetConfig = (): IWidgetPbTop => cloneDeep(this.state);

    render() {
        return null;
    }
}
