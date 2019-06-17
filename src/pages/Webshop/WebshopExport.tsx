import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { download } from 'src/utils/Download';

import { IStore } from 'src/store';
import { IAppsOptions } from 'src/entities/Apps/store';
import { IRequest } from 'src/components/RequestTracker/RequestTracker';

import { exportProducts, IExportProductsRequestParams, IExportProductsResult } from 'src/entities/ShopItems/services/ExportProducts';
import { exportSingles, IExportSinglesRequestParams, IExportSinglesResult } from 'src/entities/ShopItems/services/ExportSingles';

import Button from 'ui/lib/Button';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import Apps from 'src/components/Apps/Apps';
import { Row, Field, Form } from 'src/components/Form/Form';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';

import { DATE_LONG_FORMAT } from 'src/constants';

import api from 'src/routes/api';

interface IProps {
    appsOptions: IAppsOptions;
    loaders: {
        exportProducts: IRequest;
        exportSingles: IRequest;
    };
}

interface IActions {
    actions: {
        exportProducts: (params: IExportProductsRequestParams) => Promise<IExportProductsResult>;
        exportSingles: (params: IExportSinglesRequestParams) => Promise<IExportSinglesResult>;
    };
}

interface IState {
    exportAvailable: Boolean;
}

class WebshopExport extends React.PureComponent<IProps & IActions, IState> {
    state = {
        exportAvailable: !!this.props.appsOptions.selected.id,
    };

    onSubmit = async () => {
        const serviceId = String(this.props.appsOptions.selected.id);

        if (['bethesda', 'enaza'].includes(serviceId)) {
            const { data } = await this.props.actions.exportSingles({ serviceId });
            download(`${serviceId}-${moment().format(DATE_LONG_FORMAT)}.csv`, data, 'csv/text');
        } else {
            const { data } = await this.props.actions.exportProducts({ serviceId });
            download(`${serviceId}-${moment().format(DATE_LONG_FORMAT)}.csv`, data, 'csv/text');    
        }
    };

    onAppChange = () => {
        this.setState({ exportAvailable: true });
    };

    render() {
        const { loaders } = this.props;
        const { exportAvailable } = this.state;

        return (
            <Form className="col-6">
                <Row>
                    <Field>
                        <Apps permission="w.p.r" onChange={this.onAppChange} />
                    </Field>
                </Row>
                <Row className="mt-xl">
                    <Button
                        disabled={!exportAvailable}
                        isLoading={!!loaders.exportProducts || !!loaders.exportSingles}
                        mods={['wide', 'size-medium', 'font-size-medium']}
                        onClick={this.onSubmit}
                    >
                        Выгрузить
                    </Button>
                </Row>
                <RequestStatus
                    errorConfig={{
                        showDetails: true,
                        className: 'text-align-left'
                    }}
                    className="mt-s"
                    routes={[
                        api.webshop.exportProducts,
                        api.webshop.exportSingles
                    ]}
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    appsOptions: state.appsOptions
});

const mapDispatchToProps = () => ({
    actions: {
        exportSingles,
        exportProducts
    }
});

const WebshopExportWithConnect = connect(mapStateToProps, mapDispatchToProps)(WebshopExport);

export default () => (
    <RequestTracker loaders={[
        api.webshop.exportProducts,
        api.webshop.exportSingles
    ]}>
        <WebshopExportWithConnect />
    </RequestTracker>
);
