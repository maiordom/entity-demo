import React from 'react';
import get from 'lodash/get';

import Button from 'ui/lib/Button';

import { IUserEventAbstract } from 'src/entities/Events/store';
import { Container, Date, Delimiter, Name, Context } from 'src/components/Event/Event';

import css from './AccountEvent.css';

interface IProps {
    className: string;
    name: string;
    lang: string;
    currency: string;
    event: IUserEventAbstract;
    onPaymentTransfer: (event: IUserEventAbstract) => void;
    onPaymentCancel: (event: IUserEventAbstract) => void;
    onCancelGameShopOrder: (event: IUserEventAbstract) => void;
    onCancelWebshopOrder: (event: IUserEventAbstract) => void;
}

export default class AccountEventViaCard extends React.PureComponent<IProps, any> {
    state = {
        isOpened: false,
        context: {
            context: this.props.event.context,
            userEvent: this.props.event.userEvent
        }
    };

    toggle = () => {
        this.setState({ isOpened: !this.state.isOpened });
    };

    get info() {
        const { event, lang, currency } = this.props;
        const events = [
            'users.orders.completed',
            'users.game.shop.order.completed'
        ];

        if (events.includes(event.eventType)) {
            const product = get(event, 'userEvent.order.product');

            if (!product) {
                return null;
            }

            return (
                <div className="mt-s">
                    {product.mainProductName && product.mainProductName[lang] || product.name && product.name[lang]}
                    <span className={css.price}>{product.pricePerItem} {currency}</span>
                    <span className={css.quantity}>{product.quantity} шт.</span>
                </div>
            )
        }

        return null;
    }

    get control() {
        const { event, event: { eventType } } = this.props;

        if (eventType === 'users.payments.added') {
            return (
                <div className={css.controlButtons}>
                    <Button
                        className="mr-s"
                        onClick={() => this.props.onPaymentTransfer(event)}
                        theme="thin-black"
                        mods={['size-small', 'font-size-small']}
                    >
                        Трансфер
                    </Button>
                    <Button
                        onClick={() => this.props.onPaymentCancel(event)}
                        theme="thin-black"
                        mods={['size-small', 'font-size-small']}
                    >
                        Вернуть деньги
                    </Button>
                </div>
            );
        }

        if (eventType === 'users.orders.completed') {
            return (
                <Button
                    className={css.controlButtons}
                    onClick={() => this.props.onCancelWebshopOrder(event)}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Отмена транзакции
                </Button>
            );
        } else if (eventType === 'users.game.shop.order.completed') {
            return (
                <Button
                    className={css.controlButtons}
                    onClick={() => this.props.onCancelGameShopOrder(event)}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Отмена транзакции
                </Button>
            );
        }

        return null;
    }

    get link() {
        const { isOpened } = this.state;

        return (
            <div
                className={css.link}
                onClick={this.toggle}
            >
                {isOpened ? 'Скрыть' : 'Подробнее'}
            </div>
        );
    }

    render() {
        const { event, name, className } = this.props;
        const { context, isOpened } = this.state;

        return (
            <Container className={className}>
                <div className={css.inner}>
                    <div className="inline mb-xs">
                        <div className={`${css.dateWrapper} inline`}>
                            <Date>{event.userEvent.when}</Date>
                            <Delimiter />
                            {event.context.application}
                            <div className={css.sign}>@</div>
                            {event.context.ip}
                        </div>
                        {this.control}
                    </div>
                    <div className="inline justify-content-space-between">
                        <Name>{name}</Name>
                    </div>
                    {this.info}
                    {this.link}
                </div>
                {isOpened && (
                    <Context className="mt-m">
                        {JSON.stringify(context, null, 2)}
                    </Context>
                )}
            </Container>
        );
    }
}
