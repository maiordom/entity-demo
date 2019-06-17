import React from 'react';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import Paginator from 'ui/lib/Paginator';
import Spinner from 'ui/lib/Spinner';

import getPromoCodeByCode, { IGetPromoCodeByCodeRequestParams, IGetPromoCodeByCodeResult } from 'src/entities/PromoCodes/services/GetPromoCodeByCode';
import getPromoCodeActivations, { IGetPromoCodeActivationsRequestParams, IGetPromoCodeActivationsResult } from 'src/entities/PromoCodes/services/GetPromoCodeActivations';
import getAccountsByIds, { IGetAccountsByIdsRequestParams, IGetAccountsByIdsResult } from 'src/entities/Accounts/services/GetAccountsByIds';

import { IAccount } from 'src/entities/Accounts/models/Account';
import { IPromoCodeActivation } from 'src/entities/PromoCodes/models/PromoCodeActivation';

import Table from 'src/components/Table/Table';
import { Form, Row } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { getRoute } from 'src/routes/client';

export interface IProps {
    loaders: {
        getPromoCodeByCode?: boolean;
        getPromoCodeActivations?: boolean;
        getAccountsByIds?: boolean;
    }
}

export interface IActions {
    actions: {
        getPromoCodeByCode: (params: IGetPromoCodeByCodeRequestParams) => Promise<IGetPromoCodeByCodeResult>;
        getPromoCodeActivations: (params: IGetPromoCodeActivationsRequestParams) => Promise<IGetPromoCodeActivationsResult>;
        getAccountsByIds: (params: IGetAccountsByIdsRequestParams) => Promise<IGetAccountsByIdsResult>;
    };
}

export interface IState {
    promoCodeId: string;
    count: number;
    total: number;
    from: number;
    items: Array<IPromoCodeActivation>;
    accounts: { [key: string]: IAccount; };
}

import api from 'src/routes/api';

export class PromoCodeActivations extends React.PureComponent<IProps & IActions, {}> {
    state = {
        promoCodeId: null,
        total: null,
        count: 10,
        from: 0,
        items: null,
        accounts: {}
    };

    searchPromoCodeActivationsRef: React.RefObject<Input<any>> = React.createRef();

    onPageChange = async (page: { selected: number; }) => {
        const { promoCodeId, count } = this.state;
        const from = page.selected * count;

        this.getPromoCodeActivations(promoCodeId, from);
    };

    async getPromoCodeActivations(promoCodeId: string, from: number) {
        const { count, accounts } = this.state;
        const { items, total } = await this.props.actions.getPromoCodeActivations({
            promoCodeId,
            count,
            from
        });
        const userIds: Array<number> = uniq(items.map(item => item.userId));
        const { accounts: accountsByIds } = await this.props.actions.getAccountsByIds({ userIds });

        this.setState({
            promoCodeId,
            from,
            items,
            total,
            accounts: accountsByIds.reduce((result, account) => {
                result[account.id] = account;
                return result;
            }, accounts)
        });
    }

    onSearchPromoCodeActivationsClick = async (event) => {
        event.preventDefault();

        const promoCode = this.searchPromoCodeActivationsRef.current.getValue();

        const { id: promoCodeId } = await this.props.actions.getPromoCodeByCode({ promoCode });

        if (promoCodeId) {
            this.getPromoCodeActivations(promoCodeId, 0);
            return;
        }

        this.setState({ promoCodeId, from: 0, items: [], total: null });
    };

    render() {
        const { loaders } = this.props;
        const { items, total, count, accounts } = this.state;
        const hasActivations = items && items.length > 0;
        const noData = items && items.length === 0;
        const pageCount = Math.ceil(total / count);

        return (
            <Container>
                <Title>Активации</Title>
                <Inner className="mt-xl pb-xl ml-xl">
                    <Form>
                        <Row className="align-items-flex-end">
                            <Input
                                ref={this.searchPromoCodeActivationsRef}
                                label="Поиск по активированному промокоду"
                                placeholder="Пример ввода: NP71-GN72-RC0R-BYUO"
                                theme="light"
                            />
                            <Button
                                isLoading={loaders.getPromoCodeActivations || loaders.getPromoCodeByCode}
                                onClick={this.onSearchPromoCodeActivationsClick}
                                className="ml-m col-3"
                                mods={['size-medium', 'font-size-medium']}
                                type="submit"
                            >
                                Найти
                            </Button>
                        </Row>                   
                    </Form>
                    <RequestStatus
                        errorConfig={{
                            showDetails: true,
                            className: 'mt-l text-align-left'
                        }}                            
                        routes={[
                            api.promoCodes.getPromoCodeByCode,
                            api.promoCodes.getPromoCodeActivations
                        ]}
                    />
                    {hasActivations && <>
                        <div className="mt-m font-size-big">Всего активаций: {total}</div>
                        <Table
                            className="mt-m"
                            data={items}
                            columns={[
                                {
                                    text: 'Пользователь',
                                    field: 'userId',
                                    renderCell: (item, value) => (
                                        <a
                                            href={getRoute('account', { id: item.userId })}
                                            target="__blank"
                                        >
                                            {value} ({accounts[item.userId].email || accounts[item.userId].username})
                                        </a>
                                    )
                                },
                                { text: 'Дата', field: 'whenActivated' }
                            ]}
                        />
                        {pageCount > 1 && (
                            <div className="mt-s inline-flex align-items-center">
                                <Paginator
                                    theme="light"
                                    pageCount={pageCount}
                                    nextLabel="Следующий"
                                    previousLabel="Предыдущий"
                                    onPageChange={this.onPageChange}
                                />
                                {loaders.getPromoCodeActivations && (
                                    <Spinner size="small" className="inline ml-m" />
                                )}
                            </div>
                        )}
                    </>}
                    {noData && (
                        <div className="mt-l">Нет данных</div>
                    )}
                </Inner>
            </Container>
        );
    }
}

const mapDispatchToProps = () => ({
    actions: {
        getPromoCodeByCode,
        getPromoCodeActivations,
        getAccountsByIds
    }
});

const PromoCodeActivationsWithConnect = connect(null, mapDispatchToProps)(PromoCodeActivations);

export default () => (
    <RequestTracker loaders={[
        api.promoCodes.getPromoCodeByCode,
        api.promoCodes.getPromoCodeActivations,
        api.accounts.getAccountsByIds
    ]}>
        <PromoCodeActivationsWithConnect />
    </RequestTracker>
);
