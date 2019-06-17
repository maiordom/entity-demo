import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import Loader from 'ui/lib/Loader';
import Icon from 'ui/lib/Icon';

import { getServicesStatuses } from 'src/entities/StatusMonitor/actions';
import { createServerCheck, ICreateServerCheckParams } from 'src/entities/StatusMonitor/actions';
import { editServerCheck, IEditServerCheckParams } from 'src/entities/StatusMonitor/actions';
import { createServer, ICreateServerParams } from 'src/entities/StatusMonitor/actions';
import { removeServerCheck, IRemoveServerCheckParams } from 'src/entities/StatusMonitor/actions';

import { IStatusMonitor, IServiceStatuses } from 'src/entities/StatusMonitor/store';
import { IServerCheck, ICheckMode, IServerChecks } from 'src/entities/StatusMonitor/models/ServerChecks';

import { Error } from 'src/components/Form/Form';
import { IStore } from 'src/store';
import { Container, Title, Inner } from 'src/components/Layout/Layout';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import Overlay from 'src/components/Overlay/Overlay';
import ServiceStatuses from './ServiceStatuses';
import ServerCheck from './ServerCheck';

import api from 'src/routes/api';

interface IProps {
    statusMonitor: IStatusMonitor;
    loaders?: {
        getServicesStatuses: boolean;
    };
}

interface IActions {
    actions: {
        removeServerCheck: (params: IRemoveServerCheckParams) => void;
        createServer: (params: ICreateServerParams) => void;
        getServicesStatuses: () => void;
        editServerCheck: (params: IEditServerCheckParams) => void;
        createServerCheck: (params: ICreateServerCheckParams) => void;
    };
}

interface IState {
    serviceType: string;
    serverCheckType: string;
    currentServerCheck: IServerCheck;
    currentServerChecks: IServerChecks;
    currentServiceStatuses: IServiceStatuses;
    isVisibleServerCheckOverlay: boolean;
}

import css from './StatusMonitor.css';

class StatusMonitor extends React.PureComponent<IProps & IActions, IState> {
    state = {
        serviceType: 'create',
        serverCheckType: 'create',
        currentServerCheck: null,
        currentServiceStatuses: null,
        currentServerChecks: null,
        isVisibleServerCheckOverlay: false
    };

    getServicesStatusesInterval: any;
    overlayServiceStatusesRef: React.RefObject<Overlay> = React.createRef();
    overlayServerCheckRef: React.RefObject<Overlay> = React.createRef();

    componentDidMount() {
        this.props.actions.getServicesStatuses();

        this.getServicesStatusesInterval = setInterval(() => {
            this.props.actions.getServicesStatuses();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.getServicesStatusesInterval);
    }

    onServiceStatusClick = (serviceStatuses: IServiceStatuses) => {
        this.setState({
            serviceType: 'edit',
            currentServiceStatuses: serviceStatuses
        }, () => {
            this.overlayServiceStatusesRef.current.toggleVisibility(true);
        });
    };

    onServerCheckOverlayChange = () => {
        this.setState({ isVisibleServerCheckOverlay: false });
    };

    onServiceStatusesChange = () => {
        this.setState({ isVisibleServerCheckOverlay: false });
    };

    onEditServerCheckClick = (serverChecks: IServerChecks, serverCheck: IServerCheck) => {
        this.setState({
            serverCheckType: 'edit',
            isVisibleServerCheckOverlay: true,
            currentServerCheck: serverCheck,
            currentServerChecks: serverChecks
        }, () => {
            this.overlayServerCheckRef.current.toggleVisibility(true);
        });
    };

    onCreateServiceClick = () => {
        this.setState({
            serviceType: 'create',
            currentServiceStatuses: {
                serviceId: null,
                environment: null,
                servers: []
            }
        }, () => {
            this.overlayServiceStatusesRef.current.toggleVisibility(true);
        });
    };

    onCreateServerCheckClick = (serverChecks: IServerChecks) => {
        this.setState({
            serverCheckType: 'create',
            isVisibleServerCheckOverlay: true,
            currentServerCheck: null,
            currentServerChecks: serverChecks
        }, () => {
            this.overlayServerCheckRef.current.toggleVisibility(true);
        });
    };

    onCreateServerChecksClick = (serverName: string, checkMode: ICheckMode) => {
        const { currentServiceStatuses } = this.state;
        const { serviceId, environment } = currentServiceStatuses;

        this.props.actions.createServer({
            serviceId,
            environment,
            serverName,
            checkMode
        });
    };

    onServerCheckRemove = (serverCheck: IServerCheck) => {
        const { currentServerChecks: serverChecks, currentServiceStatuses } = this.state;
        const { serviceId, environment } = currentServiceStatuses;

        this.props.actions.removeServerCheck({
            serverChecks,
            serviceId,
            environment,
            serverCheck
        });

        this.overlayServerCheckRef.current.toggleVisibility();
    };

    onServerCheckCreate = (serverCheck: IServerCheck) => {
        const { currentServerChecks: serverChecks, currentServiceStatuses } = this.state;
        const { serviceId, environment } = currentServiceStatuses;

        this.props.actions.createServerCheck({
            serviceId,
            environment,
            serverChecks,
            serverCheck
        });

        this.overlayServerCheckRef.current.toggleVisibility();
    };

    onServerCheckEdit = (oldServerCheck: IServerCheck, newServerCheck: IServerCheck) => {
        const { currentServerChecks: serverChecks, currentServiceStatuses } = this.state;
        const { serviceId, environment } = currentServiceStatuses;

        this.props.actions.editServerCheck({
            serverChecks,
            serviceId,
            environment,
            newServerCheck,
            oldServerCheck
        });

        this.overlayServerCheckRef.current.toggleVisibility();
    };

    onServiceChecksRemove = () => {
        this.overlayServiceStatusesRef.current.toggleVisibility();
        this.props.actions.getServicesStatuses();
    };

    onServiceChecksCreate = () => {
        this.props.actions.getServicesStatuses();
    };

    onServiceChecksEdit = () => {
        this.props.actions.getServicesStatuses();
    };

    get createServiceButton() {
        return (
            <div
                onClick={this.onCreateServiceClick}
                className={`${css.service} inline align-items-center justify-content-center`}
            >
                <Icon className={css.plus} category="controls" name="plus" />
            </div>
        );
    }

    render() {
        const { loaders, statusMonitor: { servicesStatuses } } = this.props;
        const hasData = servicesStatuses.length;
        const {
            serviceType,
            serverCheckType,
            currentServerCheck,
            currentServiceStatuses,
            isVisibleServerCheckOverlay
        } = this.state;

        return (
            <Container>
                <Title className="inline align-items-center mb-s">
                    Статус монитор
                    {loaders.getServicesStatuses && (
                        <Loader className="ml-m inline" size="small" />
                    )}
                </Title>
                <div className="ml-xl">Данные монитора автоматически обновляются раз в 10 секунд</div>
                <Inner className="mt-xl pb-xl ml-xl">
                    <Error
                        showDetails
                        className="text-align-left mb-m"
                        route={api.statusMonitor.getServicesStatuses}
                    />
                    <Overlay
                        ref={this.overlayServiceStatusesRef}
                        onChange={this.onServiceStatusesChange}
                    >
                        <ServiceStatuses
                            type={serviceType}
                            onCreateServerChecksClick={this.onCreateServerChecksClick}
                            onCreateServerCheckClick={this.onCreateServerCheckClick}
                            mod={isVisibleServerCheckOverlay ? 'wide' : null}
                            onEditServerCheckClick={this.onEditServerCheckClick}
                            serviceStatuses={currentServiceStatuses}
                            onServiceChecksRemove={this.onServiceChecksRemove}
                            onServiceChecksCreate={this.onServiceChecksCreate}
                            onServiceChecksEdit={this.onServiceChecksEdit}
                        />
                    </Overlay>
                    <Overlay
                        mod="secondary"
                        onChange={this.onServerCheckOverlayChange}
                        ref={this.overlayServerCheckRef}
                    >
                        <ServerCheck
                            type={serverCheckType}
                            title={serverCheckType === 'create' ? 'Создать проверку' : 'Редактировать проверку'}
                            actionTitle={serverCheckType === 'create' ? 'Создать' : 'Редактировать'}
                            serverCheck={currentServerCheck}
                            onServerCheckRemove={this.onServerCheckRemove}
                            onServerCheckCreate={this.onServerCheckCreate}
                            onServerCheckEdit={this.onServerCheckEdit}
                        />
                    </Overlay>
                    {hasData ?
                        <div className="inline flex-wrap-wrap">
                            {servicesStatuses.map(serviceStatuses => (
                                <div className={css.service} onClick={() => {
                                    this.onServiceStatusClick(serviceStatuses);
                                }}>
                                    <div className="mb-s font-size-big">
                                        {serviceStatuses.serviceId}
                                        <span className={css.environment}>
                                            {serviceStatuses.environment}
                                        </span>
                                    </div>
                                    {serviceStatuses.servers.map(server => (
                                        <div className={css.server}>
                                            <span className={classNames(
                                                css.status,
                                                server.isAvailable
                                                    ? css.available
                                                    : css.notAvailable
                                            )}></span>
                                            {server.name}
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {this.createServiceButton}
                        </div>
                    : <>
                        <div className="mb-m">Нет данных</div>
                        <div className="inline">
                            {this.createServiceButton}
                        </div>
                    </>}
                </Inner>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    statusMonitor: state.statusMonitor
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        createServer,
        createServerCheck,
        editServerCheck,
        getServicesStatuses,
        removeServerCheck
    }, dispatch)
});

const StatusMonitorWithConnect = connect(mapStateToProps, mapDispatchToProps)(StatusMonitor);

export default () => (
    <RequestTracker loaders={[
        api.statusMonitor.getServicesStatuses
    ]}>
        <StatusMonitorWithConnect />
    </RequestTracker>
);
