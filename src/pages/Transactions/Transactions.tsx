import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import findIndex from 'lodash/findIndex';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import Spinner from 'ui/lib/Spinner';

import Overlay from 'src/components/Overlay/Overlay';
import Table from 'src/components/Table/Table';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { Form, Row } from 'src/components/Form/Form';

import { getAccounts, IGetAccountsRequestParams, IGetAccountsResult } from 'src/entities/Accounts/services/GetAccounts';
import { getTransactions, IGetTransactionsParams, IGetTransactionsResult } from 'src/entities/Billing/services/GetTransactions';
import { setTransactions, ISetTransactionsParams } from 'src/entities/Billing/actions';
import { setTransactionsValue, ISetTransactionsValueParams } from 'src/entities/Billing/actions';

import { ITransactions } from 'src/entities/Billing/store';
import { IStore } from 'src/store';
import { ITransaction } from 'src/entities/Billing/models/Transaction';

import TransferPayment from './TransferPayment';
import CancelBonus from './CancelBonus';
import CancelPayment from './CancelPayment';

interface IProps {
    transactions: ITransactions;
    loaders: {
        getTransactions: boolean;
        getAccounts: boolean;
    };
}

interface IActions {
    actions: {
        setTransactions: (params: ISetTransactionsParams) => void;
        getTransactions: (params: IGetTransactionsParams) => Promise<IGetTransactionsResult>;
        getAccounts: (params: IGetAccountsRequestParams) => Promise<IGetAccountsResult>;
        setTransactionsValue: (params: ISetTransactionsValueParams) => void;
    };
}

interface IState {
    currentTransaction: ITransaction;
    checkLoaders: boolean;
}

import api from 'src/routes/api';

class Transactions extends React.Component<IProps & IActions, IState> {
    state = {
        currentTransaction: null,
        checkLoaders: true
    };

    overlayPaymentTransferRef: React.RefObject<Overlay> = React.createRef();
    overlayCancelBonusRef: React.RefObject<Overlay> = React.createRef();
    overlayCancelPaymentRef: React.RefObject<Overlay> = React.createRef();

    inputGetTransactionsRef: React.RefObject<Input<any>> = React.createRef();

    onGetTransactions = async (event) => {
        event.preventDefault();

        const items = await this.getTransactions(0);

        this.props.actions.setTransactions({ items, from: 0 });
    };

    onGetMoreTransactions = async () => {
        const { from, count } = this.props.transactions;
        const items = await this.getTransactions(from);

        this.props.actions.setTransactions({
            items: [...this.props.transactions.items, ...items],
            from: from + count
        });
    };

    async getTransactions (from: number) {
        const value = this.inputGetTransactionsRef.current.getValue();
        const { count } = this.props.transactions;

        const { accounts: [ account ] } = await this.props.actions.getAccounts({ contact: value });

        if (!account) {
            this.props.actions.setTransactions({ items: [], from: 0 });
            return [];
        }

        const { id: userId } = account;
        const { items } = await this.props.actions.getTransactions({
            userId: Number(userId),
            from,
            count
        });

        return items;
    }

    onSearchChange = (value: string) => {
        this.props.actions.setTransactionsValue({ value });
    };

    onOverlayChange = () => {
        this.setState({ checkLoaders: true });
    };

    onBonusCancel = (item: ITransaction) => {
        this.setState({ currentTransaction: item, checkLoaders: false });
        this.overlayCancelBonusRef.current.toggleVisibility(true);
    };

    onPaymentCancel = (item: ITransaction) => {
        this.setState({ currentTransaction: item, checkLoaders: false });
        this.overlayCancelPaymentRef.current.toggleVisibility(true);
    };

    onPaymentTransfer = (item: ITransaction) => {
        this.setState({ currentTransaction: item, checkLoaders: false });
        this.overlayPaymentTransferRef.current.toggleVisibility(true);
    };

    renderRowControls = (item: ITransaction) => {
        if (item.type === 'payment') {
            return (<>
                <Button
                    locator="transfer-button-in-table"
                    className="mr-s"
                    onClick={() => this.onPaymentTransfer(item)}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Трансфер
                </Button>
                <Button
                    locator="cancel-button-in-table"
                    onClick={() => this.onPaymentCancel(item)}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Вернуть деньги
                </Button>
            </>);
        }

        if (item.type === 'bonus') {
            return (
                <Button
                    onClick={() => this.onBonusCancel(item)}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Вернуть бонусы
                </Button>
            );
        }

        return null;
    }

    updateTransactions = async() => {
        const items = await this.getTransactions(0);
        const lastItemId = this.props.transactions.items[0].id;
        const { from, count } = this.props.transactions;
        const lastItemIndex = findIndex(items, { id: lastItemId });

        if (lastItemIndex >= 1) {
            const newItems = items.slice(0, lastItemIndex);

            this.props.actions.setTransactions({
                items: [...newItems, ...this.props.transactions.items],
                from: from + count + newItems.length
            });
        }
    };

    onTransferPaymentComplete = () => this.updateTransactions();

    onCancelBonusComplete = () => this.updateTransactions();

    onCancelPaymentComplete = () => this.updateTransactions();

    render() {
        const { loaders } = this.props;
        const { items, value, hasNextPage } = this.props.transactions;
        const { currentTransaction, checkLoaders } = this.state;
        const hasTransactions = items && items.length > 0;
        const noData = items && items.length === 0;

        return (
            <Container>
                <Title>Транзакции</Title>
                <Inner className="mt-xl pb-xl ml-xl">
                    <Form>
                        <Row className="align-items-flex-end">
                            <Input
                                locator="search-transactions-input"
                                className="col-6"
                                ref={this.inputGetTransactionsRef}
                                label="Поиск по логину / userId"
                                placeholder="Пример ввода: clean142"
                                theme="light"
                                onChange={this.onSearchChange}
                                value={value}
                            />
                            <Button
                                locator="search-transactions-button"
                                isLoading={checkLoaders && (loaders.getTransactions || loaders.getAccounts)}
                                onClick={this.onGetTransactions}
                                className="ml-m col-3"
                                mods={['size-medium', 'font-size-medium']}
                                type="submit"
                            >
                                Найти
                            </Button>
                        </Row>
                    </Form>
                    {checkLoaders && (
                        <RequestStatus
                            errorConfig={{
                                showDetails: true,
                                className: 'mt-l text-align-left'
                            }}
                            routes={[
                                api.billing.getTransactions,
                                api.accounts.getAccounts
                            ]}
                        />
                    )}
                    {hasTransactions && (<>
                        <Table
                            locator="transactions"
                            rowControls={this.renderRowControls}
                            className="mt-m"
                            data={items as any}
                            columns={[
                                { text: 'ID', field: 'id' },
                                { text: 'Тип', field: 'type' },
                                { text: 'Кол-во', field: 'amount' },
                                { text: 'Дата', field: 'whenCreated' },
                                { text: 'Юзер', field: 'userId' },
                                { text: 'Кем', field: 'createdBy' },
                                { text: 'Данные', field: 'raw', collapsible: true, format: 'json' }
                            ]}
                        />
                        {hasNextPage && (
                            <div className="mt-m inline-flex align-items-center">
                                <Button
                                    onClick={this.onGetMoreTransactions}
                                    className="col-3"
                                    theme="thin-black"
                                    mods={['size-small', 'font-size-small']}
                                >
                                    Загрузить еще
                                </Button>
                                {loaders.getTransactions && (
                                    <Spinner size="small" className="inline ml-m" />
                                )}
                            </div>
                        )}
                    </>)}
                    {noData && (
                        <div className="mt-l">Нет данных</div>
                    )}
                </Inner>
                <Overlay
                    onChange={this.onOverlayChange}
                    ref={this.overlayPaymentTransferRef}
                >
                    <TransferPayment
                        contact={value}
                        onComplete={this.onTransferPaymentComplete}
                        transaction={currentTransaction}
                    />
                </Overlay>
                <Overlay
                    onChange={this.onOverlayChange}
                    ref={this.overlayCancelBonusRef}
                >
                    <CancelBonus
                        onComplete={this.onCancelBonusComplete}
                        transaction={currentTransaction}
                    />
                </Overlay>
                <Overlay
                    onChange={this.onOverlayChange}
                    ref={this.overlayCancelPaymentRef}
                >
                    <CancelPayment
                        onComplete={this.onCancelPaymentComplete}
                        transaction={currentTransaction}
                    />
                </Overlay>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    transactions: state.billing.transactions
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        getTransactions,
        getAccounts,
        ...bindActionCreators({
            setTransactions,
            setTransactionsValue
        }, dispatch)
    }
});

const TransactionsWithConnect = connect(mapStateToProps, mapDispatchToProps)(Transactions);

export default () => (
    <RequestTracker loaders={[
        api.billing.getTransactions,
        api.accounts.getAccounts
    ]}>
        <TransactionsWithConnect />
    </RequestTracker>
);
