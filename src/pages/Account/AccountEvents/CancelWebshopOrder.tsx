import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';

import { Form, Row, Field, Error } from 'src/components/Form/Form';
import { IUserEventAbstract } from 'src/entities/Events/store';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { IFormikValues, Reason } from 'src/components/Reason/Reason';
import { IStore } from 'src/store';

import { cancelWebshopOrder, ICancelWebshopOrderRequestParams } from 'src/entities/Webshop/actions';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import Checkbox from 'ui/lib/Checkbox';

interface ICancelWebshopOrder extends IFormikValues {
    force?: boolean;
}

class FormikCancelWebshopOrder extends Formik<{}, ICancelWebshopOrder> {}

import api from 'src/routes/api';

interface IProps {
    lang?: string;
    event: IUserEventAbstract;
    loaders?: {
        cancelOrder: boolean;
    };
}

interface IActions {
    actions: {
        cancelWebshopOrder: (params: ICancelWebshopOrderRequestParams) => void;
    };
}

import css from 'src/components/Overlay/Overlay.css';

class CancelWebshopOrder extends React.PureComponent<IProps & IActions, any> {
    onSubmit = (params: ICancelWebshopOrder) => {
        const { event } = this.props;

        this.props.actions.cancelWebshopOrder({
            orderId: event.userEvent.order.id,
            force: params.force,
            reason: params.reason
        });
    };

    render() {
        const { event, loaders, lang } = this.props;

        return (
            <FormikCancelWebshopOrder
                initialValues={{
                    force: false,
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, handleSubmit }) => (<>
                    <Form className={`${css.container} pl-l pt-xl`}>
                        <div className="font-size-large mb-m">Отмена заказа в вебшопе</div>
                        <div className="col-7">
                            <Row>
                                <Field>
                                    <Input
                                        disabled
                                        label="Номер заказа"
                                        theme="light"
                                        value={event.userEvent.order.id}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Checkbox
                                    theme="light"
                                    label="Форс"
                                    onClick={(force: boolean) => {
                                        setFieldValue('force', force);
                                    }}
                                />
                            </Row>
                            <Reason
                                values={values}
                                setFieldValue={setFieldValue}
                            />
                        </div>
                    </Form>
                    <div className={css.panel}>
                        <Button
                            isLoading={loaders.cancelOrder}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Отменить заказ
                        </Button>
                        <div className={css.errorContainer}>
                            <Error className={css.error} route={api.webshop.cancelOrder} />
                        </div>
                    </div>
                </>)}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    lang: state.area.selected.lang
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        cancelWebshopOrder
    }, dispatch)
});

const CancelWebshopOrderWithConnect = connect(mapStateToProps, mapDispatchToProps)(CancelWebshopOrder);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.webshop.cancelOrder
    ]}>
        <CancelWebshopOrderWithConnect {...props} />
    </RequestTracker>
);