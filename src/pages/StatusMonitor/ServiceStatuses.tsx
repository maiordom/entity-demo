import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Formik } from 'formik';
import * as yup from 'yup';

import Button from 'ui/lib/Button';
import Select from 'ui/lib/Select';
import Loader from 'ui/lib/Loader';
import Icon from 'ui/lib/Icon';

import { Error, Errors } from 'src/components/Form/Form';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { IServiceStatuses, IServersChecks } from 'src/entities/StatusMonitor/store';
import { getServiceChecks, IGetServiceChecksRequestParams } from 'src/entities/StatusMonitor/actions';
import { setServiceChecks, ISetServiceChecksParams } from 'src/entities/StatusMonitor/actions';
import { createServiceChecks, ICreateServiceChecksParams } from 'src/entities/StatusMonitor/actions';
import { editServiceChecks, IEditServiceChecksParams } from 'src/entities/StatusMonitor/actions';
import { removeServiceChecks, IRemoveServiceChecksRequestParams } from 'src/entities/StatusMonitor/actions';
import { IStore } from 'src/store';
import { IServerCheck, IServerChecks } from 'src/entities/StatusMonitor/models/ServerChecks';
import ServerCreate from './ServerCreate';
import ServerChecks from './ServerChecks';
import Apps, { IOption } from 'src/components/Apps/Apps';

interface IFormikServiceStatusesValues {
    serviceId: string;
    environment: string;
}

class ServiceStatusesForm extends Formik<{}, IFormikServiceStatusesValues> {}

import api from 'src/routes/api';

export interface IProps {
    type: string;
    mod: string;
    onCreateServerCheckClick: (serverChecks: IServerChecks) => void;
    onCreateServerChecksClick: (serverName: string, checkMode: string) => void;
    onEditServerCheckClick: (serverChecks: IServerChecks, serverCheck: IServerCheck) => void;
    onServiceChecksRemove: () => void;
    onServiceChecksCreate: () => void;
    onServiceChecksEdit: () => void;
    serviceStatuses: IServiceStatuses;
    serversChecks?: IServersChecks;
    loaders?: {
        createServiceChecks: boolean;
        getServiceChecks: boolean;
        editServiceChecks: boolean;
        removeServiceChecks: boolean;
    };
}

export interface IAction {
    actions?: {
        setServiceChecks: (params: ISetServiceChecksParams) => void;
        getServiceChecks: (params: IGetServiceChecksRequestParams) => void;
        createServiceChecks: (params: ICreateServiceChecksParams) => void;
        editServiceChecks: (params: IEditServiceChecksParams) => void;
        removeServiceChecks: (params: IRemoveServiceChecksRequestParams) => Promise<void>;
    };
}

import overlayCSS from 'src/components/Overlay/Overlay.css';

const environmentOptions = [
    { id: 'qa', value: 'qa' },
    { id: 'live', value: 'live' },
    { id: 'pts', value: 'pts' }
];

class ServiceStatuses extends React.PureComponent<IProps & IAction, any> {
    componentDidMount() {
        const { serviceStatuses: { environment, serviceId }, type } = this.props;

        if (type === 'edit') {
            this.props.actions.getServiceChecks({ environment, serviceId });
        } else {
            this.props.actions.setServiceChecks({
                id: null,
                serversChecks: [],
                environment: null,
                serviceId: null
            });
        }
    }

    onEditServerCheckClick = (serverChecks: IServerChecks, serverCheck: IServerCheck) => {
        this.props.onEditServerCheckClick(serverChecks, serverCheck);
    };

    onCreateServerCheckClick = (serverChecks: IServerChecks) => {
        this.props.onCreateServerCheckClick(serverChecks);
    };

    onCreateServerSubmit = (serverName: string, checkMode: string) => {
        this.props.onCreateServerChecksClick(serverName, checkMode);
    };

    onRemoveServiceChecksClick = async () => {
        const { serversChecks } = this.props;

        await this.props.actions.removeServiceChecks({ id: serversChecks.id });

        this.props.onServiceChecksRemove();
    };

    onServiceChecksEdit = async ({ serviceId, environment }: IFormikServiceStatusesValues) => {
        const { serversChecks } = this.props;

        await this.props.actions.editServiceChecks({
            serversChecks,
            serviceId,
            environment
        });

        this.props.onServiceChecksEdit();
    };

    onServiceChecksCreate = async ({ serviceId, environment }: IFormikServiceStatusesValues) => {
        await this.props.actions.createServiceChecks({
            serviceId,
            environment,
            serversChecks: this.props.serversChecks
        });

        this.props.onServiceChecksCreate();
    };

    render() {
        const { type, serversChecks, loaders, mod } = this.props;
        const { serviceStatuses, serviceStatuses: { environment, serviceId } } = this.props;
        const hasServerChecks = typeof serversChecks === 'object';

        return (
            <ServiceStatusesForm
                initialValues={{
                    serviceId,
                    environment
                }}
                validationSchema={yup.object().shape({
                    environment: yup.string().nullable(true).required('Необходимо указать окружение'),
                    serviceId: yup.string().nullable(true).required('Необходимо указать сервис')
                })}
                onSubmit={type === 'create'
                    ? this.onServiceChecksCreate
                    : this.onServiceChecksEdit
                }
                render={({ handleSubmit, errors, values, setFieldValue }) => (
                    <div className={classNames(
                        overlayCSS.container,
                        overlayCSS[mod],
                        'pl-l',
                        'pt-xl'
                    )}>
                        <div className="inline">
                            <div className="col-4">
                                <Apps
                                    disabled={type === 'edit'}
                                    status={errors.serviceId ? 'error' : null}
                                    hint={errors.serviceId && String(errors.serviceId)}                                
                                    title="Сервис"
                                    localChanges
                                    value={values.serviceId}
                                    onChange={(option: IOption) => {
                                        setFieldValue('serviceId', String(option.id));
                                    }}
                                />
                            </div>
                            <div className="col-4 ml-m">
                                <Select
                                    locator="environment-select"
                                    disabled={type === 'edit'}
                                    status={errors.environment ? 'error' : null}
                                    hint={errors.environment && String(errors.environment)}
                                    onChange={(environment: string) => {
                                        setFieldValue('environment', environment);
                                    }}
                                    title="Окружение"
                                    theme="light"
                                    placeholder="Выбери окружение"
                                    options={environmentOptions}
                                    value={values.environment}
                                />
                            </div>
                            {loaders.getServiceChecks && (
                                <Loader className="ml-s align-self-center" size="small" />
                            )}
                        </div>
                        <div className="mt-xl">
                            <Error
                                showDetails
                                className="text-align-left mb-m"
                                route={api.statusMonitor.getServiceChecks}
                            />
                            {serversChecks && serversChecks.items.map(serverChecks => (
                                <div className="mb-s">
                                    <ServerChecks
                                        serviceStatuses={serviceStatuses}
                                        serverChecks={serverChecks}
                                        onEditServerCheckClick={this.onEditServerCheckClick}
                                        onCreateServerCheckClick={this.onCreateServerCheckClick}
                                    />
                                </div>
                            ))}
                            {hasServerChecks && (
                                <ServerCreate
                                    actionTitle="Добавить сервер"
                                    onValueSet={this.onCreateServerSubmit}
                                />
                            )}
                        </div>
                        {type === 'create'
                            ? <div className={overlayCSS.panel}>
                                <Button
                                    locator="create-server-button"
                                    isLoading={loaders.createServiceChecks}
                                    onClick={handleSubmit}
                                    className="col-4 flex-shrink-none"
                                >
                                    Создать
                                </Button>
                                <div className={overlayCSS.errorContainer}>
                                    <Error
                                        showDetails
                                        className={overlayCSS.error}
                                        route={api.statusMonitor.createServiceChecks}
                                    />
                                    <RequestStatus
                                        className="ml-s"
                                        render={() => `Проверки созданы, статусы на доске обновляются не сразу`}
                                        route={api.statusMonitor.createServiceChecks}
                                    />
                                </div>
                            </div>
                            : <div className={overlayCSS.panel}>
                                <Button
                                    locator="save-button"
                                    disabled={!hasServerChecks}
                                    isLoading={loaders.editServiceChecks}
                                    onClick={handleSubmit}
                                    className="col-4 flex-shrink-none"
                                >
                                    Сохранить
                                </Button>
                                <div className={overlayCSS.errorContainer}>
                                    <RequestStatus
                                        errorConfig={{
                                            showDetails: true,
                                            className: overlayCSS.error
                                        }}
                                        className="ml-s"
                                        render={(request, route) => {
                                            if (route === api.statusMonitor.editServiceChecks) {
                                                return 'Проверки сохранены, статусы на доске обновляются не сразу';
                                            }
                                        }}
                                        routes={[
                                            api.statusMonitor.editServiceChecks,
                                            api.statusMonitor.removeServiceChecks
                                        ]}
                                    />
                                </div>
                                <Button
                                    locator="remove-button"
                                    disabled={!hasServerChecks}
                                    isLoading={loaders.removeServiceChecks}
                                    onClick={this.onRemoveServiceChecksClick}
                                    className="remove-button"
                                    theme="thin-black"
                                >
                                    <Icon
                                        className="remove-button-icon"
                                        name="cross"
                                    />
                                </Button>
                            </div>
                        }
                    </div>
                )}
            >
            </ServiceStatusesForm>
        );
    }
}

const mapStateToProps = (state: IStore, ownProps: IProps) => ({
    serversChecks: state.statusMonitor.serversChecks[
        `${ownProps.serviceStatuses.environment}_${ownProps.serviceStatuses.serviceId}`
    ]
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getServiceChecks,
        setServiceChecks,
        createServiceChecks,
        editServiceChecks,
        removeServiceChecks
    }, dispatch)
});

const ServiceStatusesWithConnect = connect(mapStateToProps, mapDispatchToProps)(ServiceStatuses);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.statusMonitor.getServiceChecks,
        api.statusMonitor.editServiceChecks,
        api.statusMonitor.createServiceChecks,
        api.statusMonitor.removeServiceChecks
    ]}>
        <ServiceStatusesWithConnect {...props} />
    </RequestTracker>
);
