import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import Table from 'src/components/Table/Table';
import Spinner from 'ui/lib/Spinner';

import { getAccountBalance, IGetAccountBalanceRequestParams } from 'src/entities/Billing/actions';
import { IBalance } from 'src/entities/Billing/models/Balance';
import { IStore } from 'src/store';
import { IAccount } from 'src/entities/Accounts/models/Account';

import api from 'src/routes/api';

export interface IProps {
    balance: IBalance;
    loaders?: {
        getAccountBalance: boolean;
        setTestMoney: boolean;
    };
}

interface IActions {
    actions: {
        getAccountBalance: (params: IGetAccountBalanceRequestParams) => void;
    };
}

interface IOwnProps {
    account: IAccount;
}

interface IState {
    testAccountError: string;
}

class AccountBalance extends React.PureComponent<IProps & IActions & IOwnProps, IState> {
    static defaultProps = {
        balance: {},
        hasRightForSetTestAccount: false
    };

    state: IState = {
        testAccountError: ''
    };

    componentDidMount() {
        const userId = this.props.account.id;

        this.props.actions.getAccountBalance({ userId });
    }

    render() {
        const { balance, loaders } = this.props;
        const hasData = Object.keys(balance).length > 0;

        return (<>
            <div
                data-locator="balance-widget"
                className="
                    font-size-large
                    line-height-m
                    inline
                    align-items-center
                ">
                    Баланс
                    {(loaders.getAccountBalance || loaders.setTestMoney) && (
                        <Spinner className="ml-s inline" size="small" />
                    )}
            </div>
            {hasData &&
                <Table
                    locator="balance"
                    className="mt-s"
                    orientation="vertical"
                    data={balance as any}
                    rows={[
                        { text: 'Деньги', field: 'money' },
                        { text: 'Бонус', field: 'bonus' },
                        { text: 'Баланс', field: 'balance' }
                    ]}
                />
            }
            {!hasData && (
                <div className="mt-s">Нет данных</div>
            )}
        </>);
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => ({
    balance: state.billing.balance[ownProps.account.id]
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getAccountBalance
    }, dispatch)
})

const AccountBalanceWithConnect = connect(mapStateToProps, mapDispatchToProps)(AccountBalance);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.billing.getAccountBalance,
        api.billing.setTestMoney
    ]}>
        <AccountBalanceWithConnect {...props} />
    </RequestTracker>
);
