import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';

import { Form, Row, Field, Error } from 'src/components/Form/Form';
import { IUserEventAbstract } from 'src/entities/Events/store';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { IFormikValues, Reason } from 'src/components/Reason/Reason';
import { IStore } from 'src/store';

import { cancelGameShopOrder, ICancelGameShopOrderRequestParams } from 'src/entities/GameShop/actions';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

class FormikCancelGameOrder extends Formik<{}, IFormikValues> {}

import api from 'src/routes/api';

interface IProps {
    lang?: string;
    event: IUserEventAbstract;
    loaders?: {
        cancelGameShopOrder: boolean;
    };
}

interface IActions {
    actions: {
        cancelGameShopOrder: (params: ICancelGameShopOrderRequestParams) => void;
    };
}

import css from 'src/components/Overlay/Overlay.css';

class CancelGameShopOrder extends React.PureComponent<IProps & IActions, any> {
    onSubmit = (params: IFormikValues) => {
        const { event } = this.props;

        this.props.actions.cancelGameShopOrder({
            orderId: event.userEvent.orderId,
            toPartnerId: event.serviceId,
            reason: params.reason
        });
    };

    render() {
        const { event, loaders, lang } = this.props;

        return (
            <FormikCancelGameOrder
                initialValues={{
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
                        <div className="font-size-large mb-m">Отмена заказа в геймшопе</div>
                        <div className="col-7">
                            <Row>
                                <Field>
                                    <Input
                                        disabled
                                        label="Номер заказа"
                                        theme="light"
                                        value={event.userEvent.orderId}
                                    />
                                </Field>
                            </Row>
                            <Reason
                                values={values}
                                setFieldValue={setFieldValue}
                            />
                        </div>
                    </Form>
                    <div className={css.panel}>
                        <Button
                            isLoading={loaders.cancelGameShopOrder}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Отменить заказ
                        </Button>
                        <div className={css.errorContainer}>
                            <Error className={css.error} route={api.gameShop.cancelGameShopOrder} />
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
        cancelGameShopOrder
    }, dispatch)
});

const CancelGameShopOrderWithConnect = connect(mapStateToProps, mapDispatchToProps)(CancelGameShopOrder);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.gameShop.cancelGameShopOrder
    ]}>
        <CancelGameShopOrderWithConnect {...props} />
    </RequestTracker>
);
