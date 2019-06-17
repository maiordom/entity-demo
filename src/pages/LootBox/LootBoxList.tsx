import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Spinner from 'ui/lib/Spinner';

import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import LootBoxWidget from './LootBoxWidget';
import { Title, Inner } from 'src/components/Layout/Layout';
import LootBoxCreate from './LootBoxCreate';
import LootBoxDropArea from './LootBoxDropArea';

import { setLootBox, ISelectLootBoxParams } from 'src/entities/LootBoxes/actions';
import getLootBoxes, { IGetLootBoxesResult, IGetLootBoxesRequestParams } from 'src/entities/LootBoxes/services/GetLootBoxes';
import getLootBoxFromCSV, {
    IGetLootBoxFromCSVRequestParams,
    IGetLootBoxFromCSVUrlParams,
    IGetLootBoxFromCSVResponse
} from 'src/entities/LootBoxes/services/GetLooxBoxFromCSV';
import { setLootBoxes, ISetLootBoxesParams } from 'src/entities/LootBoxes/actions';
import { selectBrowserTab, ISelectBrowserTabParams } from 'src/entities/BrowserTabs/actions';
import { setBrowserTab, ISetBrowserTabParams } from 'src/entities/BrowserTabs/actions';
import getLootBox, { IGetLootBoxRequestParams, IGetLootBoxResult } from 'src/entities/LootBoxes/services/GetLootBox';
import { getRoute } from 'src/routes/client';

import { IAionLootBoxes } from 'src/entities/LootBoxes/store';
import { IStore } from 'src/store';
import { ILootBox } from 'src/entities/LootBoxes/models/LootBox';

export interface IOwnProps {
    shortServiceId: string;
    projectName: string;
    serviceId: string;
    routes: { [key: string]: string; }
}

export interface IProps {
    lang: string;
    lootBoxes: IAionLootBoxes;
    loaders: {
        getLootBoxes: boolean;
        getLootBoxFromCSV: boolean;
    };
}

export interface IActions {
    actions: {
        getLootBoxFromCSV: (
            urlParams: IGetLootBoxFromCSVUrlParams,
            requestParams: IGetLootBoxFromCSVRequestParams
        ) => Promise<IGetLootBoxFromCSVResponse>;
        setLootBox: (params: ISelectLootBoxParams) => void;
        setBrowserTab: (params: ISetBrowserTabParams) => void;
        selectBrowserTab: (params: ISelectBrowserTabParams) => void;
        getLootBoxes: (params: IGetLootBoxesRequestParams) => Promise<IGetLootBoxesResult>;
        setLootBoxes: (params: ISetLootBoxesParams) => void;
        getLootBox: (params: IGetLootBoxRequestParams) => Promise<IGetLootBoxResult>;
    };
}

interface IState {
    uploadCSVStatus: null | 'error' | 'loading';
}

import api from 'src/routes/api';

type TProps = IOwnProps & IProps & IActions & RouteComponentProps<any>;

class LootBoxList extends React.Component<TProps, IState> {
    state: IState = {
        uploadCSVStatus: null
    };

    componentDidMount() {
        const { serviceId, projectName } = this.props;

        this.props.actions.selectBrowserTab({ id: null, projectName });

        this.props.actions.getLootBoxes({ serviceId, from: 0, count: 100 }).then(({ items }) => {
            this.props.actions.setLootBoxes({ items, projectName: this.props.projectName });
        });
    }

    onWheelClick = (lootBox: ILootBox) => {
        const { id, name } = lootBox;
        const { lang, projectName } = this.props;

        this.props.actions.setBrowserTab({
            id,
            params: { title: name[lang] },
            projectName
        });
        this.props.actions.selectBrowserTab({ id, projectName });
        this.props.history.push(getRoute(this.props.routes.item, { id }));
    };

    onLootBoxCreate = async () => {
        const { lang, projectName, serviceId, shortServiceId } = this.props;
        const timeStamp = String((new Date()).getTime());

        const name = '<Лутбокс>';
        const emptyLootBox: ILootBox = {
            id: 'new',
            withdrawn: true,
            type: shortServiceId,
            versions: [],
            components: [],
            slug: `lootbox-${serviceId}.${timeStamp}`,
            name: {
                [lang]: name
            }
        };
        const { id } = emptyLootBox;

        this.props.actions.setLootBox({ lootBox: emptyLootBox, projectName });
        this.props.actions.setBrowserTab({ id, params: { title: name }, projectName });
        this.props.actions.selectBrowserTab({ id, projectName });
        this.props.history.push(getRoute(this.props.routes.item, { id }));
    };

    onLootBoxDrop = async (file: File) => {
        const { lang, projectName, serviceId, shortServiceId } = this.props;
        const nameArray = file.name.split('.');
        const timeStamp = String((new Date()).getTime());

        nameArray.pop();
        nameArray.push(timeStamp);

        const name = '<Лутбокс>';
        const slug = nameArray.join('.');
        const emptyLootBox: ILootBox = {
            id: 'new',
            withdrawn: true,
            type: shortServiceId,
            versions: [],
            components: [],
            slug,
            name: {
                [lang]: name
            }
        };
        const { id } = emptyLootBox;

        this.setState({ uploadCSVStatus: 'loading' });
        const { data, data: { components } } = await this.props.actions.getLootBoxFromCSV({ serviceId }, { file });

        emptyLootBox.components = components;

        if (!data) {
            this.setState({ uploadCSVStatus: 'error' });
            return;
        }

        this.props.actions.setLootBox({ lootBox: emptyLootBox, projectName });
        this.props.actions.setBrowserTab({ id, params: { title: name }, projectName });
        this.props.actions.selectBrowserTab({ id, projectName });
        this.props.history.push(getRoute(this.props.routes.item, { id }));
        this.setState({ uploadCSVStatus: null });
    };

    render() {
        const { uploadCSVStatus } = this.state;
        const { loaders } = this.props;
        const { items } = this.props.lootBoxes;
    
        return (<>
            <LootBoxDropArea
                status={uploadCSVStatus}
                onDrop={this.onLootBoxDrop}
            />
            <Title className="inline align-items-center">
                Колесо фортуны
                {loaders.getLootBoxes && (
                    <Spinner size="small" className="ml-s" />
                )}
            </Title>
            <Inner className="mt-m ml-xl">
                <div className="inline flex-flow-wrap">
                    <LootBoxCreate
                        isLoading={loaders.getLootBoxFromCSV}
                        onClick={this.onLootBoxCreate}
                        className="mr-s"
                    />
                    {items.map(lootBox => (
                        <LootBoxWidget
                            key={lootBox.id}
                            lootBox={lootBox}
                            className="mr-s mb-s"
                            onClick={this.onWheelClick}
                        />
                    ))}
                </div>
                <RequestStatus
                    errorConfig={{
                        showDetails: true,
                        className: 'mt-s text-align-left'
                    }}
                    className="ml-s"
                    routes={[
                        api.webshop.getLootBoxes,
                        api.webshop.getLootBoxFromCSV
                    ]}
                />
            </Inner>
        </>);
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => ({
    lang: state.area.selected.lang,
    lootBoxes: state.lootBoxes[ownProps.projectName]
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        getLootBoxes,
        getLootBox,
        getLootBoxFromCSV,
        ...bindActionCreators({
            setBrowserTab,
            setLootBoxes,
            selectBrowserTab,
            setLootBox
        }, dispatch)
    }
});

const LootBoxListWithConnect = withRouter(connect(mapStateToProps, mapDispatchToProps)(LootBoxList));

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.webshop.getLootBoxes,
        api.webshop.getLootBoxFromCSV
    ]}>
        <LootBoxListWithConnect {...props} />
    </RequestTracker>
);
