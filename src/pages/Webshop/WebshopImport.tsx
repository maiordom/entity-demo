import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IStore } from 'src/store';
import { IAppsOptions } from 'src/entities/Apps/store';

import Button from 'ui/lib/Button';

import { importProducts, IImportProductsRequestParams } from 'src/entities/ShopItems/services/ImportProducts';
import { importSingles, IImportSinglesRequestParams } from 'src/entities/ShopItems/services/ImportSingles';

import { IRequest } from 'src/components/RequestTracker/RequestTracker';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import UploadButton from 'src/components/UploadButton/UploadButton';
import Apps from 'src/components/Apps/Apps';
import { Row, Field, Form } from 'src/components/Form/Form';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';

import api, { TImportType } from 'src/routes/api';

interface IProps {
    appsOptions: IAppsOptions;
    loaders: {
        importProducts: IRequest;
        importSingles: IRequest;
    };
}

interface IState {
    importAvailable: Boolean;
    fileName: string;
}

export interface IActions {
    actions: {
        importProducts: (params: IImportProductsRequestParams, type: TImportType) => void;
        importSingles: (params: IImportSinglesRequestParams, type: TImportType) => void;
    };
}

class WebshopImport extends React.PureComponent<IProps & IActions, IState> {
    state = {
        importAvailable: false,
        fileName: ''
    };

    fileType?: TImportType | string = '';
    file?: File;

    onImportChange = (file: File) => {
        this.file = file;

        const fileName = file.name;
        const fileType = fileName.match(/\.(zip|csv)/) && fileName.match(/\.(zip|csv)/)[1] || '';

        this.fileType = fileType;
        this.setState({ fileName: file.name }, () => {
            this.validate();
        });
    };

    onAppChange = () => {
        this.validate();
    };

    validate() {
        const selectedApp = this.props.appsOptions.selected.id;

        this.setState({
            importAvailable: !!this.state.fileName && !!selectedApp
        });
    }

    onSubmit = () => {
        const { fileType, file } = this;
        let type: TImportType = 'csv';
        let serviceId = String(this.props.appsOptions.selected.id);

        if (fileType === 'zip') {
            type = 'dump';
        }

        if (['bethesda', 'enaza'].includes(serviceId)) {
            this.props.actions.importSingles({ serviceId, file }, type);
            return;
        }

        this.props.actions.importProducts({ serviceId, file }, type);
    }

    render() {
        const { importAvailable, fileName } = this.state;
        const { loaders } = this.props;

        return (
            <Form className="col-6">
                <Row>
                    <Field>
                        <Apps permission="w.p.w" onChange={this.onAppChange} />
                    </Field>
                </Row>
                <Row col className="mt-m">
                    <p className="color-grey">1. Для обновления параметров товаров используйте CSV файл</p>
                    <p className="color-grey mt-s">2. Для добавления новых товаров или обновления изображений товаров используйте ZIP файл</p>
                </Row>
                <Row className="mt-m">
                    <Field>
                        <UploadButton
                            label="Выбери CSV или ZIP файл"
                            title={fileName ? 'Изменить файл' : 'Выбрать файл'}
                            onChange={this.onImportChange}
                        />
                    </Field>
                </Row>
                <Row className="mt-xl">
                    <Button
                        isLoading={!!loaders.importProducts || !!loaders.importSingles}
                        disabled={!importAvailable}
                        mods={['wide', 'size-medium', 'font-size-medium']}
                        onClick={this.onSubmit}
                    >
                        Загрузить
                    </Button>
                </Row>
                <RequestStatus
                    errorConfig={{
                        showDetails: true,
                        className: 'text-align-left'
                    }}
                    className="mt-s"
                    routes={[
                        api.webshop.importProducts,
                        api.webshop.importSingles
                    ]}
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    appsOptions: state.appsOptions
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        importSingles,
        ...bindActionCreators({ importProducts }, dispatch)
    }
});

const WebshopImportWithConnect = connect(mapStateToProps, mapDispatchToProps)(WebshopImport);

export default () => (
    <RequestTracker loaders={[
        api.webshop.importProducts,
        api.webshop.importSingles
    ]}>
        <WebshopImportWithConnect />
    </RequestTracker>
);
