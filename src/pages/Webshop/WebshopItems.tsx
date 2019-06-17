import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProductCard from 'ui/lib/ProductCard';
import Spinner from 'ui/lib/Spinner';
import Tree, { INode } from 'ui/lib/Tree/Tree';
import GridLayout from 'ui/lib/GridLayout';
import Paginator from 'ui/lib/Paginator';

import withMedia from 'src/utils/WithMedia';
import { IStore } from 'src/store';
import Apps, { IOption } from 'src/components/Apps/Apps';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { getWebshopCategories, IGetWebshopCategoriesRequestParams } from 'src/entities/WebshopCategories/actions';
import { IWebshopCategory } from 'src/entities/WebshopCategories/store';
import { getShopItems, IGetShopItemsRequestParams } from 'src/entities/ShopItems/actions';
import { setShopItems, ISetShopItemsParams } from 'src/entities/ShopItems/actions';
import { IShopItems } from 'src/entities/ShopItems/store';

const ProductCardWithMedia = withMedia(ProductCard);

import api from 'src/routes/api';

interface IState {
    tree: INode;
    selectedNodeId: string | null | number;
}

interface IProps {
    shopItems: IShopItems;
    lang: string;
    serviceId: string;
    categories: { [categoryId: string]: IWebshopCategory; }
    loaders?: {
        getWebshopCategories: boolean;
        getShopItems: boolean;
    };
}

interface IActions {
    actions: {
        getWebshopCategories: (params: IGetWebshopCategoriesRequestParams) => Promise<void>;
        getShopItems: (params: IGetShopItemsRequestParams) => void;
        setShopItems: (params: ISetShopItemsParams) => void;
    };
}

import css from './WebshopItems.css';

class WebshopItemsPage extends React.PureComponent<IProps & IActions, IState> {
    state = {
        tree: null,
        selectedNodeId: null
    };

    componentDidMount() {
        const { serviceId } = this.props;

        if (serviceId) {
            this.props.actions.getWebshopCategories({ serviceId });
        }
    }

    traverseCategory(category: IWebshopCategory, tree: INode) {
        const { lang } = this.props;

        tree.name = category.name && category.name[lang];
        tree.id = category.id;

        if (!tree.children) {
            tree.children = [];
        }

        category.childrens.forEach(category => {
            const node: INode = {
                id: category.id,
                name: category.name && category.name[lang],
                children: []
            };

            tree.children.push(node)
            this.traverseCategory(category, node);
        });
    }

    componentWillReceiveProps(nextProps: IProps) {
        const { serviceId } = nextProps;

        if (
            nextProps.categories.tree && nextProps.categories.tree !== this.props.categories.tree
        ) {
            const { tree: rawTree } = nextProps.categories;
            const tree: INode = {};

            if (!Object.keys(rawTree).length) {
                this.props.actions.setShopItems({ items: [], from: 0, total: 0 });
                this.setState({ tree: null, selectedNodeId: null });
                return;
            }

            const [ root ] = Object.keys(rawTree).map(key => rawTree[key]);

            this.traverseCategory(root, tree);

            this.props.actions.getShopItems({
                categoryId: Number(tree.id),
                serviceId,
                count: 10,
                from: 0
            });

            this.setState({
                tree,
                selectedNodeId: tree.id
            });
        }
    }

    onPageChange = ({ selected }: { selected: number }) => {
        const { serviceId, shopItems: { count } } = this.props;
        const { selectedNodeId } = this.state;

        this.props.actions.getShopItems({
            categoryId: selectedNodeId,
            serviceId,
            count,
            from: selected * count
        });
    };

    onAppChange = (app: IOption) => {
        this.props.actions.getWebshopCategories({ serviceId: String(app.id) });
    };

    onNodeSelect = (node: INode) => {
        this.setState({ selectedNodeId: node.id });
        this.props.actions.getShopItems({
            categoryId: Number(node.id),
            serviceId: this.props.serviceId,
            count: 10,
            from: 0
        });
    };

    render() {
        const { loaders, shopItems, lang } = this.props;
        const { tree, selectedNodeId } = this.state;
        const hasProducts = shopItems && shopItems.searchResult.length > 0;
        const pageCount = hasProducts && Math.ceil(shopItems.total / shopItems.count);

        return (
            <div className="ml-xl">
                <div className="inline align-items-center">
                    <div className="col-6">
                        <Apps onChange={this.onAppChange} />
                    </div>
                    {(loaders.getWebshopCategories || loaders.getShopItems) && (
                        <Spinner className="ml-m" size="small" />
                    )}
                </div>
                <RequestStatus
                    errorConfig={{
                        showDetails: true,
                        className: 'mt-m text-align-left'
                    }}
                    routes={[
                        api.webshopCategories.getWebshopCategories,
                        api.webshop.getShopItems
                    ]}
                />
                <div className="mt-m inline">
                    {tree && (
                        <div className="mr-s col-4 flex-shrink-none">
                            <Tree
                                key={tree.id}
                                className={css.tree}
                                theme="light"
                                node={tree}
                                selectNode={this.onNodeSelect}
                                selectedNodeId={selectedNodeId}
                            />
                        </div>
                    )}
                    <div className={css.items}>
                        <GridLayout columnsPerItem={4}>
                            <div className={css.itemsInner}>
                                {shopItems.searchResult.length ? shopItems.searchResult.map(item => (
                                    <ProductCardWithMedia
                                        path="products.launcherProduct"
                                        theme="light"
                                        className="mr-s mb-s"
                                        id={item.id}
                                        price={item.price}
                                        serviceId={item.serviceId}
                                        title={item.name[lang]}
                                    />
                                )) : <div>Нет данных</div>}
                            </div>
                            {pageCount > 1 && (
                                <div className="mt-s pb-l inline-flex align-items-center">
                                    <Paginator
                                        theme="light"
                                        pageCount={pageCount}
                                        nextLabel="Следующий"
                                        previousLabel="Предыдущий"
                                        onPageChange={this.onPageChange}
                                    />
                                    {loaders.getShopItems && (
                                        <Spinner size="small" className="inline ml-m" />
                                    )}
                                </div>
                            )}
                        </GridLayout>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    lang: state.area.selected.lang,
    serviceId: state.appsOptions.selected.id,
    categories: state.webshopCategories[state.appsOptions.selected.id] || {},
    shopItems: state.shopItems
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getWebshopCategories,
        getShopItems,
        setShopItems
    }, dispatch)
});

const WebshopItemsWithConnect = connect(mapStateToProps, mapDispatchToProps)(WebshopItemsPage);

export default () => (
    <RequestTracker loaders={[
        api.webshopCategories.getWebshopCategories,
        api.webshop.getShopItems
    ]}>
        <WebshopItemsWithConnect />
    </RequestTracker>
);
