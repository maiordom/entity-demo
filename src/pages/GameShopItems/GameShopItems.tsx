import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import pickBy from 'lodash/pickBy';
import isString from 'lodash/isString';

import Paginator from 'ui/lib/Paginator';
import Loader from 'ui/lib/Loader';
import Button from 'ui/lib/Button';

import Defer from 'src/utils/Defer';
import UploadButton from 'src/components/UploadButton/UploadButton';
import Apps, { IOption } from 'src/components/Apps/Apps';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { Error } from 'src/components/Form/Form';
import Table from 'src/components/Table/Table';
import Panel from 'src/components/Panel/Panel';
import GameShopItemManager from './GameShopItemManager';
import Overlay from 'src/components/Overlay/Overlay';

import { getGameShopItems, IGetGameShopItemsRequestParams } from 'src/entities/GameShop/actions';
import { addGameShopItems, IAddGameShopItemsRequestParams } from 'src/entities/GameShop/actions';
import { exportGameShopItems } from 'src/entities/GameShop/actions';

import { IStore } from 'src/store';
import { IGameShopItems, IPagination } from 'src/entities/GameShop/store';
import { IGameShopItem } from 'src/entities/GameShop/models/GameShopItem';

import api from 'src/routes/api';

interface IProps {
    loaders?: {
        getGameShopItems: boolean;
        addGameShopItems: boolean;
        addGameShopItem: boolean;
    };
    app: IOption;
    pagination: IPagination;
    gameShopItems: IGameShopItems;
}

interface IState {
    gameShopItemManagerType: string;
    currentGameShopItem: IGameShopItem;
}

interface IActions {
    actions: {
        getGameShopItems: (params: IGetGameShopItemsRequestParams, { page: number }) => void;
        addGameShopItems: (params: IAddGameShopItemsRequestParams) => Promise<void>;
        exportGameShopItems: (toPartnerId: string) => void;
    };
}

class GameShopItems extends React.PureComponent<IProps & IActions, IState> {
    state = {
        gameShopItemManagerType: 'create',
        currentGameShopItem: null
    };

    overlayGameShopItemManager: React.RefObject<Overlay> = React.createRef();

    componentDidMount() {
        const { app } = this.props;

        if (app.id) {
            this.getGameShopItems(0);
        }
    }

    onAppChange = (app: IOption) => {
        this.getGameShopItems(0, String(app.id));
    };

    onActionCompleted = () => {
        this.getGameShopItems(0);
    };

    getGameShopItems(page: number, toPartnerId?: string) {
        const { pagination, app } = this.props;

        this.props.actions.getGameShopItems({
            offset: page * pagination.count,
            count: pagination.count,
            toPartnerId: toPartnerId || String(app.id)
        }, { page });
    }

    onPageChange = (page: { selected: number; }) => {
        this.getGameShopItems(page.selected);
    };

    getGameShopItemsFromCSV = (file: File) => {
        const reader = new FileReader();
        const defer = Defer();

        reader.onload = (fileEntity) => {
            const result = fileEntity.target.result.split('\n');

            const gameShopItems = result.reduce((items, value) => {
                if (value) {
                    const [ id, ru, en, pt ] = value.split(';');
                    const gameShopItem: IGameShopItem = {
                        id,
                        name: pickBy({
                            ru,
                            en,
                            pt
                        }, isString)
                    };

                    items.push(gameShopItem);
                }

                return items;
            }, []);

            defer.resolve({ items: gameShopItems });
        };

        reader.onerror = () => {
            defer.reject();
        };

        reader.readAsText(file);

        return defer.promise;
    };

    onAddGameShopItems = async (file: File) => {
        const { app } = this.props;
        const { items } = await this.getGameShopItemsFromCSV(file);

        await this.props.actions.addGameShopItems({ items, toPartnerId: String(app.id) });
        this.getGameShopItems(0, String(app.id));
    };

    onExportGameShopItems = () => {
        const { app } = this.props;

        this.props.actions.exportGameShopItems(String(app.id));
    };

    onAddGameShopItemClick = () => {
        this.overlayGameShopItemManager.current.toggleVisibility(true);
    };

    onOverlayChange = () => {
        this.setState({
            gameShopItemManagerType: 'create',
            currentGameShopItem: null
        });
    };

    onGameShopItemManagerClose = () => {
        this.overlayGameShopItemManager.current.toggleVisibility();
    };

    get controls() {
        const { loaders } = this.props;

        return (
            <div className="inline mt-m">
                <div className="inline align-items-center">
                    <UploadButton
                        locator="import-button"
                        displayFileName={false}
                        title="Импорт файла"
                        onChange={this.onAddGameShopItems}
                    />
                    {loaders.addGameShopItems && (
                        <Loader className="ml-m" size="small" />
                    )}
                </div>
                <div className="inline align-items-center ml-s">
                    <Button
                        locator="export-button"
                        onClick={this.onExportGameShopItems}
                        mods={['size-small', 'font-size-small']}
                        theme="thin-black"
                    >
                        Экспорт
                    </Button>
                    {loaders.getGameShopItems && (
                        <Loader className="ml-m" size="small" />
                    )}
                </div>
            </div>
        );
    }

    onEditGameShopItemClick = (gameShopItem: IGameShopItem) => {
        this.setState({
            gameShopItemManagerType: 'edit',
            currentGameShopItem: gameShopItem
        }, () => {
            this.overlayGameShopItemManager.current.toggleVisibility(true);
        });
    };

    renderRowControls = (gameShopItem: IGameShopItem) => {
        return (
            <Button
                locator="edit-button"
                className="col-3"
                onClick={() => this.onEditGameShopItemClick(gameShopItem)}
                theme="thin-black"
                mods={['wide', 'size-small', 'font-size-small']}
            >
                Редактировать
            </Button>
        );
    };

    get items() {
        const { gameShopItems, loaders, pagination } = this.props;
        const hasEvents = gameShopItems && gameShopItems.items.length > 0;
        const pageCount = hasEvents && Math.ceil(gameShopItems.total / pagination.count);

        return (
            hasEvents && (<>
                <Table
                    locator="gameshop-items-table"
                    rowControls={this.renderRowControls}
                    className="mt-l"
                    data={gameShopItems.items as any}
                    columns={[
                        { text: 'ID', field: 'id' },
                        { text: 'RU', field: 'name.ru' },
                        { text: 'EN', field: 'name.en' },
                        { text: 'PT', field: 'name.pt' }
                    ]}
                />
                {pageCount > 1 && (
                    <div className="mt-s inline-flex align-items-center">
                        <Paginator
                            forcePage={pagination.page}
                            theme="light"
                            pageCount={pageCount}
                            nextLabel="Следующий"
                            previousLabel="Предыдущий"
                            onPageChange={this.onPageChange}
                        />
                        {loaders.getGameShopItems && (
                            <Loader size="small" className="inline ml-m" />
                        )}
                    </div>
                )}
            </>)
        );
    }

    render() {
        const { items, controls } = this;
        const { gameShopItems, loaders } = this.props;
        const { gameShopItemManagerType, currentGameShopItem } = this.state;
        const noData = gameShopItems && gameShopItems.items.length === 0;

        return (<>
            <Container>
                <Title>Предметы</Title>
                <Inner className="mt-xl pb-xxl ml-xl">
                    <div className="inline align-items-center">
                        <div className="col-6">
                            <Apps locator="gameshop-items" onChange={this.onAppChange} />
                        </div>
                        {loaders.getGameShopItems && (
                            <Loader className="ml-m" size="small" />
                        )}
                    </div>
                    {controls}
                    <Error showDetails className="text-align-left mt-m" route={
                        api.gameShop.getGameShopItems
                    } />
                    <Error showDetails className="text-align-left mt-m" route={
                        api.gameShop.addGameShopItems
                    } />
                    {items}
                    {noData && (
                        <div className="mt-m">Нет данных</div>
                    )}
                </Inner>
                <Panel>
                    <Button
                        locator="add-button"
                        isLoading={loaders.addGameShopItem}
                        className="col-6"
                        onClick={this.onAddGameShopItemClick}
                    >
                        Добавить слово
                   </Button>
                </Panel>
                <Overlay
                    onChange={this.onOverlayChange}
                    ref={this.overlayGameShopItemManager}
                >
                    <GameShopItemManager
                        onClose={this.onGameShopItemManagerClose}
                        onEdit={this.onActionCompleted}
                        onCreate={this.onActionCompleted}
                        gameShopItem={currentGameShopItem}
                        type={gameShopItemManagerType}
                    />
                </Overlay>
            </Container>
        </>);
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    app: state.appsOptions.selected,
    gameShopItems: state.gameShop.items[state.appsOptions.selected.id],
    pagination: state.gameShop.pagination
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getGameShopItems,
        addGameShopItems,
        exportGameShopItems
    }, dispatch)
});

const GameShopItemsWithConnect = connect(mapStateToProps, mapDispatchToProps)(GameShopItems);

export default () => (
    <RequestTracker loaders={[
        api.gameShop.getGameShopItems,
        api.gameShop.addGameShopItems
    ]}>
        <GameShopItemsWithConnect />
    </RequestTracker>
);
