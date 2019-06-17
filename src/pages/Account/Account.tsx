import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import find from 'lodash/find';

import AccountAbstract, { IProps, IOwnProps } from 'src/pages/Account/AccountAbstract';
import { IStore } from 'src/store';
import { IAccount } from 'src/entities/Accounts/models/Account';

import { getAccounts, IGetAccountsRequestParams, IGetAccountsResult } from 'src/entities/Accounts/actions';
import { openAccount, IOpenAccountParams } from 'src/entities/Accounts/actions';
import { setAccountBrowserTab, ISetAccountBrowserTabParams } from 'src/entities/Accounts/actions';

interface IActions {
    actions: {
        getAccounts: (params: IGetAccountsRequestParams) => Promise<IGetAccountsResult>;
        openAccount: (params: IOpenAccountParams) => void;
        setBrowserTab: (params: ISetAccountBrowserTabParams) => void;
    };
}

class Account extends AccountAbstract<IActions & IProps & IOwnProps> {
    async componentDidMount() {
        const { id, items } = this.props;
        let account: IAccount = find(items, { id: Number(id) });

        if (account) {
            this.props.actions.setBrowserTab({ id: Number(account.id) });
        } else {
            this.props.actions.setBrowserTab({ id: Number(id) });
            let { accounts: [ account ] } = await this.props.actions.getAccounts({ contact: id });

            if (account) {
                this.props.actions.openAccount({ account });
            }
        }
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    selectedItem: state.accounts.selectedItem,
    items: state.accounts.items,
    balance: state.accounts.selectedItem && state.billing.balance[state.accounts.selectedItem.id]
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getAccounts,
        openAccount,
        setBrowserTab: setAccountBrowserTab
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
