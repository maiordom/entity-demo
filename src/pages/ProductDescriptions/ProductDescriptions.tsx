import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';

import { Container, Title, Inner, Scrollable } from 'src/components/Layout/Layout';
import { Form, Row } from 'src/components/Form/Form';
import Table from 'src/components/Table/Table';

import Input from 'ui/lib/Input';
import BrowserTabs from 'ui/lib/BrowserTabs';
import Button from 'ui/lib/Button';
import Apps from 'src/components/Apps/Apps';

import { setShopItems, ISetShopItemsParams } from 'src/entities/ShopItems/actions';
import { getProduct, IGetProductRequestParams, IGetProductResult } from 'src/entities/Product/services/GetProduct';
import { getShopItems, IGetShopItemsRequestParams } from 'src/entities/ShopItems/actions';
import { closeShopBrowserTab as closeBrowserTab, ICloseShopBrowserTabParams } from 'src/entities/ShopItems/actions';
import { openShopItem, IOpenShopItemParams } from 'src/entities/ShopItems/actions';
import { setShopBrowserTab as setBrowserTab, ISetShopBrowserTabParams } from 'src/entities/ShopItems/actions';
import Paginator from 'ui/lib/Paginator';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

import api from 'src/routes/api';
import { IStore } from 'src/store';
import { IShopItems } from 'src/entities/ShopItems/store';
import { IShopItem } from 'src/entities/ShopItems/models/ShopItem';

import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import ProductDescription from 'src/pages/ProductDescriptions/ProductDescription';
import Loader from 'ui/lib/Loader';

interface IProps {
    shopItems: IShopItems;
    localeKey: string;
    selectedService: string;
    loaders: {
        getDocuments: boolean;
        getShopItems: boolean;
        getShopItemDescription: boolean;
    };
}

interface IActions {
    actions: {
        setShopItems: (params: ISetShopItemsParams) => void;
        getShopItems: (params: IGetShopItemsRequestParams) => void;
        openShopItem: (params: IOpenShopItemParams) => void;
        setBrowserTab: (params: ISetShopBrowserTabParams) => void;
        closeBrowserTab: (params: ICloseShopBrowserTabParams) => void;
        getProduct: (params: IGetProductRequestParams) => Promise<IGetProductResult>;
    };
}

class ProductDescriptionsPage extends React.PureComponent<IProps & IActions, {}> {
    searchInputRef: React.RefObject<Input<any>> = React.createRef();

    componentDidMount() {
        const { selectedService, shopItems: { count } } = this.props;

        if (selectedService) {
            this.props.actions.getShopItems({ serviceId: selectedService, count });
        }
    }

    onShopItemClick = (shopItem: IShopItem) => {
        this.props.actions.openShopItem({ shopItem });
    };

    onPageChange = ({ selected }: { selected: number }) => {
        const { selectedService, shopItems: { count } } = this.props;

        this.props.actions.getShopItems({ serviceId: selectedService, count, from: selected * count });
    };

    onBrowserTabClick = (id: number) => {
        this.props.actions.setBrowserTab({ id });
    };

    onBrowserTabClose = (id: number) => {
        if (id === null) {
            return;
        }

        this.props.actions.closeBrowserTab({ id });
    };

    onGetShopItemsClick = async (event) => {
        event.preventDefault();

        const { selectedService, shopItems: { count } } = this.props;
        const name = this.searchInputRef.current.getValue();

        if (name && name.match(/^\d+$/)) {
            const product = await this.props.actions.getProduct({ productId: name });
            let total = 1;
            let items = [ product ];

            if (!product) {
                total = 0;
                items = [];
            }

            this.props.actions.setShopItems({ items, from: 0, total });
        } else if (name) {
            this.props.actions.getShopItems({ serviceId: selectedService, count, name });
        } else {
            this.props.actions.getShopItems({ serviceId: selectedService, count });
        }
    };

    getItems = () => {
        const { selectedService, shopItems: { count } } = this.props;

        this.props.actions.getShopItems({ serviceId: selectedService, count });
    }

    get items() {
        const { searchResult: items, total, count } = this.props.shopItems;
        const { localeKey, loaders } = this.props;
        const hasItems = items.length;

        if (!hasItems) {
            return null;
        }

        const pageCount = Math.ceil(total / count);

        return hasItems && (<>
            <Table
                locator="products"
                onRawClick={this.onShopItemClick}
                className="mt-m"
                data={items as any}
                columns={[
                    { text: 'ID', field: 'id' },
                    { text: 'Имя', field: `name.${localeKey}` },
                    { text: 'Slug', field: 'slug' },
                ]}
            />
            {pageCount > 1 && (
                <Row className="mt-s">
                    <Paginator
                        theme="light"
                        pageCount={pageCount}
                        nextLabel="Следующий"
                        previousLabel="Предыдущий"
                        onPageChange={this.onPageChange}
                    />
                    {loaders.getShopItems && (
                        <Loader className="ml-s" size="small"/>
                    )}
                </Row>
            )}
        </>);
    }

    get search() {
        const { loaders } = this.props;
        const { items } = this;

        return (<>
            <Title>Товары</Title>
            <Inner className="mt-xl pb-xxl ml-xl">
                <Form>
                    <Row className="align-items-flex-end">
                        <Input
                            locator="product-name"
                            ref={this.searchInputRef}
                            className="col-6 mr-xl"
                            label="Поиск"
                            placeholder="Укажи name/slug/id для поиска"
                            theme="light"
                        />
                        <div className="col-6 mr-xl">
                            <Apps locator="product-services" />
                        </div>
                        <Button
                            locator="product-search-button"
                            isLoading={loaders.getShopItems}
                            onClick={this.onGetShopItemsClick}
                            className="col-3"
                            mods={['size-medium', 'font-size-medium']}
                            type="submit"
                        >
                            Найти
                        </Button>
                    </Row>
                </Form>
                {items}
                <RequestStatus
                    errorConfig={{
                        showDetails: true,
                        className: 'text-align-left mt-m'
                    }}
                    routes={[
                        api.webshop.getShopItems,
                        api.webshop.getProduct
                    ]}
                />
            </Inner>
        </>);
    }

    render() {
        const { selectedItem, selectedBrowserTab, browserTabs } = this.props.shopItems;
        const { localeKey, loaders: { getShopItemDescription, getDocuments } } = this.props;
        let tabContent = this.search;

        if (selectedBrowserTab.type === 'shopItem') {
            tabContent = <ProductDescription
                shopItem={selectedItem}
                localeKey={localeKey}
                isLoading={[getShopItemDescription, getDocuments].some(Boolean)}
            />
        }

        return (
            <Container hasVerticalScroll>
                <div className="browser-tabs">
                    <BrowserTabs
                        onClick={this.onBrowserTabClick}
                        onClose={this.onBrowserTabClose}
                        theme="admin"
                        items={browserTabs}
                        selected={selectedBrowserTab}
                    />
                </div>
                <Scrollable>
                    {tabContent}
                </Scrollable>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    shopItems: state.shopItems,
    selectedService: String(state.appsOptions.selected.id),
    localeKey: state.area.selected.lang
})

const mapDispatchToProps = (dispatch) => ({
    actions: {
        ...bindActionCreators({
            getShopItems,
            openShopItem,
            setBrowserTab,
            closeBrowserTab,
            setShopItems
        }, dispatch),
        getProduct
    }
});

const ProductDescriptionsPageWithConnect = connect(mapStateToProps, mapDispatchToProps)(ProductDescriptionsPage);

export default (props: IProps) => (
    <RequestTracker
        loaders={[
            api.webshop.getShopItems,
            api.documents.getShopItemDescription,
            api.documents.getDocuments,
        ]}
    >
        <ProductDescriptionsPageWithConnect {...props} />
    </RequestTracker>
);
