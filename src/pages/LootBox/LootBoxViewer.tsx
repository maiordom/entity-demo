import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router';
import { createSelector } from 'reselect';
import get from 'lodash/get';
import compact from 'lodash/compact';
import omit from 'lodash/omit';

import Checkbox from 'ui/lib/Checkbox';
import Button from 'ui/lib/Button';
import Icon from 'ui/lib/Icon';
import Spinner from 'ui/lib/Spinner';

import { ILootBox, ILootBoxComponent } from 'src/entities/LootBoxes/models/LootBox';
import { IStore } from 'src/store';
import { IImagesGroups } from 'src/entities/ImagesGroups/store';
import { IAreaItem} from 'src/entities/Area/store';

import { download } from 'src/utils/Download';
import { getRoute } from 'src/routes/client';

import {
    getLootBoxComponentsByCSV,
    IGetLootBoxComponentsByCSVRequestParams,
    IGetLootBoxComponentsByCSVResponse
} from 'src/entities/LootBoxes/services/GetLootBoxComponentsByCSV';
import getLootBoxFromCSV, {
    IGetLootBoxFromCSVRequestParams,
    IGetLootBoxFromCSVUrlParams,
    IGetLootBoxFromCSVResponse
} from 'src/entities/LootBoxes/services/GetLooxBoxFromCSV';
import createLootBox, { ICreateLootBoxRequestParams, ICreateLootBoxUrlParams, ICreateLootBoxResult } from 'src/entities/LootBoxes/services/CreateLootBox';
import getLootBox, { IGetLootBoxRequestParams, IGetLootBoxResult } from 'src/entities/LootBoxes/services/GetLootBox';
import changeLootBox, { IChangeLootBoxUrlParams, IChangeLootBoxRequestParams } from 'src/entities/LootBoxes/services/ChangeLootBox';

import { closeBrowserTab, ICloseBrowserTabParams } from 'src/entities/BrowserTabs/actions';
import { selectBrowserTab, ISelectBrowserTabParams } from 'src/entities/BrowserTabs/actions';
import { setBrowserTab, ISetBrowserTabParams } from 'src/entities/BrowserTabs/actions';
import { setLootBox, ISelectLootBoxParams } from 'src/entities/LootBoxes/actions';
import { changeLootBoxParams, IChangeLootBoxParams } from 'src/entities/LootBoxes/actions';
import { moveLootBoxComponent, IMoveLootBoxComponentParams } from 'src/entities/LootBoxes/actions';
import deleteProduct, { IDeleteProductRequestParams } from 'src/entities/Webshop/services/DeleteProduct';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import LootBoxTitle from './LootBoxTitle';
import LootBoxTableClass from './LootBoxTable';
import Panel from 'src/components/Panel/Panel';
import LootBoxVersions from './LootBoxVersions';
import Overlay from 'src/components/Overlay/Overlay';
import WheelProductManager from './WheelProductManager';
import ShootingRangeProductManager from './ShootingRangeProductManager';

type TTableConfigKey = (lang: string) => string | string;

interface IOwnProps {
    id: any;
    serviceId: string;
    projectName: string;
    routes: { [key: string]: string; };
    shortServiceId: string;
    tableConfig?: {
        keys: {
            [key: string]: Array<TTableConfigKey> | TTableConfigKey;
        };
    };
    restrictions?: {
        maxComponents: number;
    };
}

export interface IProps {
    areas: Array<IAreaItem>;
    lang: string;
    lootBox: ILootBox;
    imagesGroups: IImagesGroups;
    loaders?: {
        getLootBox: boolean;
        getLootBoxFromCSV: boolean;
        getLootBoxComponentsByCSV: boolean;
        changeLootBox: boolean;
        deleteProduct: boolean;
        createLootBox: boolean;
    };
}

export interface IActions {
    actions: {
        getLootBoxFromCSV: (
            urlParams: IGetLootBoxFromCSVUrlParams,
            requestParams: IGetLootBoxFromCSVRequestParams
        ) => Promise<IGetLootBoxFromCSVResponse>;
        createLootBox: (
            urlParams: ICreateLootBoxUrlParams,
            requestParams: ICreateLootBoxRequestParams
        ) => Promise<ICreateLootBoxResult>;
        closeBrowserTab: (params: ICloseBrowserTabParams) => void;
        deleteProduct: (params: IDeleteProductRequestParams) => void;
        moveLootBoxComponent: (params: IMoveLootBoxComponentParams) => void;
        changeLootBoxParams: (params: IChangeLootBoxParams) => void;
        changeLootBox: (urlParams: IChangeLootBoxUrlParams, params: IChangeLootBoxRequestParams) => void;
        setLootBox: (params: ISelectLootBoxParams) => void;
        getLootBoxComponentsByCSV: (params: IGetLootBoxComponentsByCSVRequestParams) => Promise<IGetLootBoxComponentsByCSVResponse>;
        getLootBox: (params: IGetLootBoxRequestParams) => Promise<IGetLootBoxResult>;
        setBrowserTab: (params: ISetBrowserTabParams) => void;
        selectBrowserTab: (params: ISelectBrowserTabParams) => void;
    };
}

interface IState {
    componentManagerType: string;
    currentLootBoxComponent: ILootBoxComponent;
}

import api from 'src/routes/api';
import clientRoutes from 'src/routes/client';

type TProps = IOwnProps & IProps & IActions & RouteComponentProps<any>;

class LootBoxTable extends LootBoxTableClass<ILootBoxComponent> {}

import css from './LootBoxViewer.css';
import overlayCSS from 'src/components/Overlay/Overlay.css';

class LootBoxViewer extends React.PureComponent<TProps, IState> {
    csvInputRef: React.RefObject<any> = React.createRef();
    overlayLootBoxProductManagerRef: React.RefObject<Overlay> = React.createRef();
    state: IState = {
        componentManagerType: 'create',
        currentLootBoxComponent: null
    };
    probabilitySumSelector = createSelector(
        (props: TProps) => props.lootBox.components,
        components => components.reduce((result, { probability }) => {
            return Number((result + probability).toFixed(3));
        }, 0)
    );

    getProbability(probability: number) {
        let value: Array<React.ReactElement<any> | string> = String(probability).split('');

        value = value.map(char => (
            <span>{char}</span>
        ));

        const fraction = Number((probability % 1).toFixed(3));
        const hiddenChars = 5 - String(fraction).length;

        if (hiddenChars > 0) {
            const hiddenCharsArr = [];

            for (let i = 0; i < hiddenChars; i++) {
                hiddenCharsArr.push(
                    <span className={css.hiddenChar}>0</span>
                );
            }

            value = [
                ...value,
                ...hiddenCharsArr
            ];
        }

        if (probability < 1) {
            value = value.splice(1);
        }

        value = [
            ...value,
            <span> %</span>
        ];

        return value;

    }

    getTableConfig(lootBox: ILootBox) {
        const { lang, tableConfig } = this.props;

        return [{ 
            name: null, 
            key: null,
            styles: {
                display: 'flex',
                justifyContent: 'flex-end',
                width: '90px'
            },
            getValue: (item: ILootBoxComponent) => (
                <img
                    style={{
                        width: '25px',
                        height: '25px',
                        objectFit: 'contain',
                        marginRight: '10px'
                    }}
                    src={this.prizeImageSrc(item.id)}
                />
            )
        }, {
            name: () => {
                const maxComponents = this.props.restrictions && this.props.restrictions.maxComponents;

                if (maxComponents) {
                    const count = <span className={
                        lootBox.components.length !== maxComponents && css.componentsCountRequired
                    }>
                        {lootBox.components.length}
                    </span>
                    
                    return (
                        <span>
                            Предметы <span className={css.componentsCount}>{count}/{maxComponents}</span>
                        </span>
                    );
                }

                return (
                    <span>
                        Предметов <span className={css.componentsCount}>
                            {lootBox.components.length}
                        </span>
                    </span>
                );
            },
            getValue: (item: ILootBoxComponent) => {
                const keys = tableConfig.keys.name as Array<TTableConfigKey>;
                const values = compact(keys.map(key => get(item, key(lang))));

                return values.join(' · ');
            },
            styles: {
                width: '320px',
                marginRight: '30px'
            }
        }, {
            name: 'Кол-во',
            key: 'quantity',
            styles: {
                width: '60px',
                marginRight: '30px',
                textAlign: 'right'
            }
        }, {
            name: () => {
                const probability = lootBox.components.reduce((result, component) => {
                    result += component.probability;
                    return Number(result.toFixed(3));
                }, 0);

                const probabilityElement = <span className={classNames(
                    css.probability,
                    probability !== 100 && css.probabilityRequired
                )}>
                    {this.getProbability(probability)}
                </span>;

                return (
                    <span>
                        Шанс {probabilityElement}
                    </span>
                );
            },
            getValue: (item: ILootBoxComponent) => {
                const { probability } = item;

                return this.getProbability(probability);
            },
            key: 'probability',
            styles: {
                width: '130px',
                marginRight: '30px',
                textAlign: 'right'
            }
        }, {
            name: null,
            key: 'isMainPrize',
            styles: {
                position: 'relative',
                top: '-1px'
            },
            getValue: (item: ILootBoxComponent) => {
                const result = [];

                if (item.isMainPrize) {
                    result.push(
                        <div className={`${css.mainPrize} mr-xs`}>главный приз</div>
                    );
                }

                result.push(
                    <Icon
                        wrapperClassName={`${css.tool} hiddable`}
                        name="tool"
                    />
                );

                return (
                    <div className="inline align-items-center">{result}</div>
                );
            }
        }, {
            name: null,
            key: null,
            styles: { width: '100%' }
        }];
    }

    async componentDidMount() {
        const { id, lang, lootBox, projectName, serviceId } = this.props;

        if (!lootBox) {
            this.props.actions.setBrowserTab({
                id,
                params: { title: '<Лутбокс>' },
                projectName
            });
            this.props.actions.selectBrowserTab({ id, projectName });

            const lootBox = await this.props.actions.getLootBox({ id, serviceId });

            if (lootBox) {
                this.props.actions.setBrowserTab({
                    id,
                    params: { title: lootBox.name[lang] },
                    projectName
                });
                this.props.actions.setLootBox({ lootBox, projectName });
            }
        } else {
            this.props.actions.selectBrowserTab({ id, projectName });
        }
    }

    onLootBoxProductManagerSubmit = () => {
        this.overlayLootBoxProductManagerRef.current.toggleVisibility();
    };

    onLootBoxSave = async () => {
        let { lootBox, lootBox: { id: lootBoxId }, serviceId, projectName } = this.props;

        if (lootBoxId && lootBoxId !== 'new') {
            await this.props.actions.changeLootBox({ serviceId }, { value: lootBox });
        } else {
            const { id } = await this.props.actions.createLootBox({ serviceId }, { value: omit(lootBox, 'id') });

            if (id === null) {
                return;
            }

            lootBoxId = id;
            this.props.actions.changeLootBoxParams({ lootBoxId: lootBox.id, changes: { id }, projectName });
            this.props.actions.setBrowserTab({ id: lootBox.id, projectName, params: { id: lootBoxId } });
            this.props.history.push(getRoute(this.props.routes.item, { id: lootBoxId }));
        }

        lootBox = await this.props.actions.getLootBox({ id: lootBoxId, serviceId });
        this.props.actions.setLootBox({ lootBox, projectName: this.props.projectName });
    };

    onComponentCreate = () => {
        this.setState({
            componentManagerType: 'create',
            currentLootBoxComponent: undefined
        }, () => {
            this.overlayLootBoxProductManagerRef.current.toggleVisibility(true);
        });
    };

    onProductDisplay = (component: ILootBoxComponent) => {
        this.setState({
            currentLootBoxComponent: component,
            componentManagerType: 'edit'
        }, () => {
            this.overlayLootBoxProductManagerRef.current.toggleVisibility(true);
        });
    };

    onLootBoxDelete = async () => {
        const { projectName, routes } = this.props;
        const { id } = this.props.lootBox;

        await this.props.actions.deleteProduct({ id });
        this.props.actions.closeBrowserTab({ id, projectName });
        this.props.history.push(clientRoutes[routes.list]);
    };

    onComponentMove = (from: number, to: number) => {
        this.props.actions.moveLootBoxComponent({
            lootBoxId: this.props.lootBox.id,
            from,
            to,
            projectName: this.props.projectName
        });
    };

    prizeImageSrc(id: number) {
        const { imagesGroups } = this.props;

        return imagesGroups
            .products
            .launcherPreview
            .replace('{id}', String(id));
    }

    onTitleChange = (name: string) => {
        const langs = this.props.areas.map(area => area.lang);
        const nextName = langs.reduce((result, lang) => {
            result[lang] = name;
            return result
        }, {});

        this.props.actions.changeLootBoxParams({
            lootBoxId: this.props.lootBox.id,
            changes: { name: nextName },
            projectName: this.props.projectName
        });
        this.props.actions.setBrowserTab({
            id: this.props.lootBox.id,
            params: { title: name },
            projectName: this.props.projectName
        });
    };

    onGetComponentsViaCSV = async () => {
        const { lootBox: { slug, id }, serviceId } = this.props;

        const { data } = await this.props.actions.getLootBoxComponentsByCSV({ serviceId, slug });

        download(`${serviceId}-${slug}-${id}.csv`, data, 'csv/text');
    };

    onWithdrawnChange = (withdrawn: boolean) => {
        this.props.actions.changeLootBoxParams({
            lootBoxId: this.props.lootBox.id,
            changes: { withdrawn: !withdrawn },
            projectName: this.props.projectName
        });
    };

    onComponentsChangeFromCSV = async (event) => {
        const file: File = event.target.files[0];
        const { lootBox: { id }, projectName, serviceId } = this.props;

        this.csvInputRef.current.value = '';

        const { data: { components } } = await this.props.actions.getLootBoxFromCSV({ serviceId }, { file });

        this.props.actions.changeLootBoxParams({ lootBoxId: id, projectName, changes: { components } });
    };

    get probabilitySum() {
        return this.probabilitySumSelector(this.props);
    }

    get isVisibleForPlayers() {
        return this.props.lootBox.versions.length > 0;
    }

    render() {
        const { lang, lootBox, loaders, restrictions, shortServiceId } = this.props;
        const { currentLootBoxComponent, componentManagerType } = this.state;
        const maxComponents = restrictions && restrictions.maxComponents;

        if (!lootBox) {
            return (
                <div className="ml-xl mt-m">
                    {loaders.getLootBox && (
                        <Spinner
                            size="small"
                            className="mb-b"
                        />
                    )}
                    <RequestStatus
                        errorConfig={{
                            showDetails: true,
                            className: 'text-align-left'
                        }}
                        routes={[ api.webshop.getLootBox ]}
                    />
                </div>
            );
        }

        const slug = lootBox.slug || '???';

        return (<>
            <div className="pb-xxl">
                <div className="inline ml-xl mr-xl mt-m justify-content-space-between">
                    <LootBoxTitle onChange={this.onTitleChange}>
                        {lootBox.name[lang]}
                    </LootBoxTitle>
                    <div className={`${css.info} inline align-items-center`}>
                        ID: {lootBox.id || '???'}
                        <span className="ml-s mr-s">·</span>
                        <span className={css.slug} title={slug}>{slug}</span>
                    </div>
                </div>
                <div className="ml-xl mt-s mb-s inline">
                    <Checkbox
                        disabled={!this.isVisibleForPlayers}
                        onClick={this.onWithdrawnChange}
                        theme="light"
                        label="Видно игрокам"
                        checked={!lootBox.withdrawn}
                    />
                </div>
                <LootBoxVersions
                    projectName={this.props.projectName}
                    className="pl-xl"
                    lootBox={lootBox}
                />
                <LootBoxTable
                    onRowMove={this.onComponentMove}
                    key={lootBox.id}
                    data={lootBox.components}
                    fields={this.getTableConfig(lootBox)}
                    onRowClick={this.onProductDisplay}
                />
                {(!maxComponents || maxComponents && lootBox.components.length < maxComponents) && (
                    <Button
                        onClick={this.onComponentCreate}
                        className={css.createComponent}
                        theme="thin-black"
                        mods={['size-small', 'font-size-small']}                    
                    >
                        Добавить новый товар
                    </Button>
                )}
                <Panel>
                    <Button
                        disabled={
                            maxComponents && lootBox.components.length > maxComponents ||
                            this.probabilitySum !== 100
                        }
                        isLoading={loaders.changeLootBox || loaders.createLootBox}
                        onClick={this.onLootBoxSave}
                        className="col-3 pl-s pr-s mr-xxs flex-shrink-fixed"
                    >
                        Сохранить
                    </Button>
                    <Button
                        isLoading={loaders.getLootBoxFromCSV}
                        className="col-5 pl-s pr-s mr-xxs file-button flex-shrink-fixed"
                        theme="thin-black"
                    >
                        Загрузить новый .CSV
                        <input
                            ref={this.csvInputRef}
                            onChange={this.onComponentsChangeFromCSV}
                            className="file-button-input"
                            type="file"
                        />
                    </Button>
                    <Button
                        isLoading={loaders.getLootBoxComponentsByCSV}
                        onClick={this.onGetComponentsViaCSV}
                        className="col-4 pl-s pr-s flex-shrink-fixed"
                        theme="thin-black"
                    >
                        Скачать как .CSV
                    </Button>
                    <div className={overlayCSS.errorContainer}>
                        <RequestStatus
                            errorConfig={{
                                showDetails: true,
                                className: overlayCSS.error
                            }}
                            className="ml-s"
                            routes={[
                                api.webshop.changeLootBox,
                                api.webshop.getLootBoxComponentsByCSV,
                                api.webshop.getLootBoxComponentsByCSV,
                                api.webshop.createLootBox
                            ]}
                        />
                    </div>
                    <Button
                        isLoading={loaders.deleteProduct}
                        onClick={this.onLootBoxDelete}
                        className="remove-button"
                        theme="thin-black"
                    >
                        <Icon name="cross" />
                    </Button>
                </Panel>
            </div>
            <Overlay ref={this.overlayLootBoxProductManagerRef}>
                {shortServiceId === 'aion' && (
                    <WheelProductManager
                        projectName={this.props.projectName}
                        type={componentManagerType}
                        lootBoxId={lootBox.id}
                        product={currentLootBoxComponent}
                        onSubmit={this.onLootBoxProductManagerSubmit}
                    />
                )}
                {shortServiceId === 'pointBlank' && (
                    <ShootingRangeProductManager
                        projectName={this.props.projectName}
                        type={componentManagerType}
                        lootBoxId={lootBox.id}
                        product={currentLootBoxComponent}
                        onSubmit={this.onLootBoxProductManagerSubmit}
                    />
                )}
            </Overlay>
        </>);
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => ({
    areas: state.area.items,
    lootBox: state.lootBoxes[ownProps.projectName].opened[ownProps.id],
    lang: state.area.selected.lang,
    imagesGroups: state.imagesGroups
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        createLootBox,
        deleteProduct,
        changeLootBox,
        getLootBoxComponentsByCSV,
        getLootBox,
        getLootBoxFromCSV,
        ...bindActionCreators({
            closeBrowserTab,
            moveLootBoxComponent,
            changeLootBoxParams,
            setBrowserTab,
            selectBrowserTab,
            setLootBox
        }, dispatch)
    }
});

const LootBoxViewerWithConnect = withRouter<IOwnProps & RouteComponentProps<any>>(connect(mapStateToProps, mapDispatchToProps)(LootBoxViewer));

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.webshop.getLootBoxComponentsByCSV,
        api.webshop.changeLootBox,
        api.webshop.createLootBox,
        api.webshop.deleteProduct,
        api.webshop.getLootBoxFromCSV,
        api.webshop.getLootBox
    ]}>
        <LootBoxViewerWithConnect {...props} />
    </RequestTracker>
);
