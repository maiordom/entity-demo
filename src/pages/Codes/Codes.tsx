import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Loader from 'ui/lib/Loader';
import Paginator from 'ui/lib/Paginator';
import Button from 'ui/lib/Button';

import { Error } from 'src/components/Form/Form';
import { Container, Title, Inner } from 'src/components/Layout/Layout';
import Apps, { IOption } from 'src/components/Apps/Apps';
import { IEmissions, IPagination } from 'src/entities/Codes/store';
import { IStore } from 'src/store';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import Table from 'src/components/Table/Table';
import TableControls from './TableControls';

import { getEmissions, IGetEmissionsRequestParams } from 'src/entities/Codes/actions';
import clientRoutes from 'src/routes/client';
import { matchToPath, IMatchToPathParams } from 'src/entities/Navigation/actions';

interface IProps {
    app: IOption;
    codes: IEmissions;
    pagination: IPagination;
    loaders?: {
        getEmissions: boolean;
    };
}

interface IActions {
    actions: {
        getEmissions: (params: IGetEmissionsRequestParams) => void;
        matchToPath: (params: IMatchToPathParams) => void;
    };
}

import api from 'src/routes/api';

type TProps = IProps & IActions & RouteComponentProps<any>;

class Codes extends React.PureComponent<TProps, {}> {
    componentDidMount() {
        const { app, pagination } = this.props;

        if (app.id) {
            this.props.actions.getEmissions({
                serviceId: String(app.id),
                count: pagination.count
            });
        }
    }

    onAppChange = (app: IOption) => {
        const { pagination } = this.props;

        this.props.actions.getEmissions({
            serviceId: String(app.id),
            count: pagination.count
        });
    };

    onPageChange = (page: { selected: number; }) => {
        const { app, pagination } = this.props;

        this.props.actions.getEmissions({
            serviceId: String(app.id),
            count: pagination.count,
            from: page.selected * pagination.count
        });
    };

    onGenerateCodesClick = () => {
        this.props.history.push(clientRoutes.createCodes);
        this.props.actions.matchToPath({ path: clientRoutes.createCodes });
    };

    renderRowControls = (item): React.ReactNode => (
        <TableControls data={item} />
    );

    get codes() {
        const { codes, pagination } = this.props;
        const hasCodes = codes && codes.emissions && codes.emissions.length > 0;

        if (!hasCodes) {
            return null;
        }

        const pageCount = Math.ceil(codes.total / pagination.count);

        if (hasCodes) {
            return (<>
                <Table
                    className="mt-l"
                    data={codes.emissions as any}
                    rowControls={this.renderRowControls}
                    columns={[
                        { text: 'ID', field: 'id' },
                        { text: 'Название', field: 'name', style: {
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block'
                        }},
                        { text: 'Автор (id)', field: 'issuedBy' },
                        { text: 'Дата создания', field: 'whenCreated' }
                    ]}
                />
                {pageCount > 1 && (
                    <div className="mt-s">
                        <Paginator
                            theme="light"
                            pageCount={pageCount}
                            nextLabel="Следующий"
                            previousLabel="Предыдущий"
                            onPageChange={this.onPageChange}
                        />
                    </div>
                )}
                <Button
                    locator="generate-codes-button"
                    className="mt-xl"
                    onClick={this.onGenerateCodesClick}
                >
                    Сгенерировать коды
                </Button>
            </>);
        }
    }

    render() {
        const { loaders } = this.props;
        const { codes } = this;

        return (
            <Container>
                <Title>Промо-коды</Title>
                <Inner className="mt-xl pb-xl ml-xl">
                    <div className="inline align-items-center">
                        <div className="col-6">
                            <Apps
                                locator="codes"
                                onChange={this.onAppChange}
                            />
                        </div>
                        {loaders.getEmissions && (
                            <Loader
                                className="ml-m"
                                size="small"
                            />
                        )}
                    </div>
                    <Error 
                        className="text-align-left mt-m"
                        route={api.codes.getEmissions}
                    />
                    {codes}
                </Inner>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    app: state.appsOptions.selected,
    codes: state.codes.items[state.appsOptions.selected.id],
    pagination: state.codes.pagination
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getEmissions,
        matchToPath
    }, dispatch)
});

const CodesWithConnect = withRouter<TProps>(connect(mapStateToProps, mapDispatchToProps)(Codes));

export default (props: TProps) => (
    <RequestTracker loaders={[
        api.codes.getEmissions,
    ]}>
        <CodesWithConnect {...props} />
    </RequestTracker>
);
