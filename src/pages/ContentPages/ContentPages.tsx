import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Loader from 'ui/lib/Loader';
import Button from 'ui/lib/Button';

import { Container, Title, Inner } from 'src/components/Layout/Layout';
import Apps, { IOption } from 'src/components/Apps/Apps';
import { IStore } from 'src/store';
import { getContentPages, IGetContentPagesRequestParams } from 'src/entities/Content/actions';
import { IContentPage } from 'src/entities/Content/store';
import Table from 'src/components/Table/Table';
import RequestTracker, { IRequest } from 'src/components/RequestTracker/RequestTracker';
import api from 'src/routes/api';
import clientRoutes from 'src/routes/client';
import TableControls from './TableControls';
import Panel from 'src/components/Panel/Panel';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';

export interface IProps {
    app: IOption;
    contentPages: Array<IContentPage>;
    loaders: {
        getContentPages: IRequest;
    };
}

export interface IActions {
    actions: {
        getContentPages: (params: IGetContentPagesRequestParams) => Promise<void>;
    };
}

import css from 'src/components/Overlay/Overlay.css';

type TProps = IProps & IActions & RouteComponentProps<any>;

class ContentPagesComponent extends React.PureComponent<TProps, any> {
    componentDidMount() {
        const { app } = this.props;

        if (app.id) {
            this.props.actions.getContentPages({ serviceId: String(app.id) });
        }
    }

    onAppChange = (app: IOption) => {
        this.props.actions.getContentPages({ serviceId: String(app.id) });
    };

    onAddPageClick = () => {
        this.props.history.push(clientRoutes.newPage);
    };

    renderRowControls = (item: IContentPage): React.ReactNode =>
        <TableControls data={item} />

    get pages() {
        const { contentPages } = this.props;
        const hasContentPages = contentPages && contentPages.length > 0;

        if (hasContentPages) {
            return (<>
                <Table
                    locator="actions"
                    className="mt-l"
                    data={contentPages as any}
                    rowControls={this.renderRowControls}
                    columns={[
                        { text: 'ID', field: 'id' },
                        { text: 'Название', field: 'name' },
                        { text: 'Дата изменения', field: 'whenModified' }
                    ]}
                />
            </>);
        }

        return null;
    }

    render() {
        const { loaders } = this.props;
        const { pages } = this;

        return (
            <Container>
                <Title>Страницы игры/Наборы виджетов</Title>
                <Inner className="mt-xl pb-xxl ml-xl">
                    <div className="inline align-items-center">
                        <div className="col-6">
                            <Apps
                                locator="widgets"
                                permission="content.read.pages"
                                onChange={this.onAppChange}
                            />
                        </div>
                        {loaders.getContentPages && (
                            <Loader className="ml-m" size="small" />
                        )}
                    </div>
                    {pages}
                </Inner>
                <Panel>
                    <Button
                        locator="actions-add-button"
                        onClick={this.onAddPageClick}
                    >
                        Добавить страницу
                    </Button>
                    <RequestStatus
                        errorConfig={{
                            showDetails: true,
                            className: css.error
                        }}
                        className="ml-s"
                        routes={[
                            api.content.getContentPages
                        ]}
                    />
                </Panel>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    app: state.appsOptions.selected,
    contentPages: state.content.items[state.appsOptions.selected.id]
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ getContentPages }, dispatch)
});

const ContentPages = withRouter<TProps>(connect(mapStateToProps, mapDispatchToProps)(ContentPagesComponent));

export default (props: TProps) => (
    <RequestTracker loaders={[
        api.content.getContentPages
    ]}>
        <ContentPages {...props} />
    </RequestTracker>
);
