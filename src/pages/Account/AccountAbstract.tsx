import React from 'react';
import { Tabs, TabPanel, Tab, TabList } from 'react-tabs';

import { IAccount } from 'src/entities/Accounts/models/Account';
import { IBalance } from 'src/entities/Billing/models/Balance';
import { Error } from 'src/components/Form/Form';
import { Title, Inner } from 'src/components/Layout/Layout';

import AccountContactsHistory from './AccountContactsHistory';
import AccountEvents from './AccountEvents/AccountEvents';
import AccountPromoCodesActivations from './AccountPromoCodesActivations';
import AccountGameAccounts from './AccountGameAccounts';
import AccountInfo from './AccountInfo/AccountInfo';
import AccountBalance from './AccountBalance';
import AccountControls from './AccountControls';
import api from 'src/routes/api';

export interface IOwnProps {
    id: string;
}

export interface IProps {
    selectedItem: IAccount;
    items: Array<IAccount>;
    balance?: IBalance;
}

type TProps = IOwnProps & IProps;

import tabsCSS from 'src/components/Tabs/Tabs.css';

export default class Account<T extends TProps> extends React.PureComponent<T, {}> {
    render() {
        let { id, selectedItem: account, balance } = this.props;

        if (account && account.id != id) {
            account = null
        }

        return (<>
            <Title className="inline">
                <div className="spacer">Пользователь ID: {id}</div>
                <AccountControls id={id} className="align-items-flex-end mr-xl" />
            </Title>
            <Inner className="mt-s pb-xxl">
                <Error
                    showDetails
                    className="text-align-left mt-m ml-xl mb-m"
                    route={api.accounts.getAccounts}
                />
                {account && (
                    <Tabs>
                        <TabList className={`${tabsCSS.list} pl-xl`}>
                            <Tab className={tabsCSS.tab}
                                data-locator="account-tablist-info"
                                selectedClassName={tabsCSS.tabSelected}
                            >
                                Информация об аккаунте
                            </Tab>
                            <Tab className={tabsCSS.tab}
                                data-locator="account-tablist-logs"
                                selectedClassName={tabsCSS.tabSelected}
                            >
                                Логи активности
                            </Tab>
                            <Tab className={tabsCSS.tab}
                                data-locator="account-tablist-codes"
                                selectedClassName={tabsCSS.tabSelected}
                            >
                                Активированные коды
                            </Tab>
                            <Tab className={tabsCSS.tab}
                                data-locator="account-tablist-service-accs"
                                selectedClassName={tabsCSS.tabSelected}
                            >
                                Сервис аккаунты
                            </Tab>
                        </TabList>
                        <TabPanel className="ml-xl">
                            <AccountInfoTabContent
                                account={account}
                                isTest={balance && balance.isTest}
                            />
                        </TabPanel>
                        <TabPanel className="ml-xl">
                            <AccountEvents userId={account.id} />
                        </TabPanel>
                        <TabPanel className="ml-xl">
                            <AccountPromoCodesActivations userId={account.id} />
                        </TabPanel>
                        <TabPanel className="ml-xl">
                            <AccountGameAccounts userId={account.id} />
                        </TabPanel>
                    </Tabs>
                )}
            </Inner>
        </>);
    }
}

const AccountInfoTabContent = ({ account, isTest }: { account: IAccount; isTest: boolean }) => (<>
    <div className="inline">
        <div className="col">
            <AccountInfo account={account} isTest={isTest} />
        </div>
        <div className="col ml-xl">
            <AccountBalance account={account} />
        </div>
    </div>
    <AccountContactsHistory userId={account.id} />
</>);
