import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import { Row, Field } from 'src/components/Form/Form';
import { IWidgetProduct } from 'src/entities/Content/store';
import { WIDGET_TYPE_PRODUCT } from './Constructor';

import Input from 'ui/lib/Input';

interface IProps {
    widget: IWidgetProduct;
}

interface IState extends IWidgetProduct {}

export default class Product extends React.PureComponent<IProps, IState> {
    state = cloneDeep(this.props.widget || {
        type: WIDGET_TYPE_PRODUCT,
        source: {}
    });

    getWidgetConfig = (): IWidgetProduct => cloneDeep(this.state);

    onProductIdChange = (value: string) => {
        this.setState({ source: { ...this.state.source, id: Number(value) } });
    };

    render() {
        const { id } = this.state.source;

        return (
            <Row className="col-6">
                <Field>
                    <Input
                        locator="product-id-input"
                        theme="light"
                        label="ID товара в шопе"
                        placeholder="ID давай"
                        value={id ? String(id) : ''}
                        onChange={this.onProductIdChange}
                    />
                </Field>
            </Row>
        );
    }
}
