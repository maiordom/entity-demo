import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loader from 'ui/lib/Loader';

import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { IStore } from 'src/store';

import Apps, { IOption } from 'src/components/Apps/Apps';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { getWebshopCategories, IGetWebshopCategoriesRequestParams } from 'src/entities/WebshopCategories/actions';
import WebshopCategory from './WebshopCategory';

import api from 'src/routes/api';

interface IProps {
    serviceId: string;
    loaders?: {
        getWebshopCategories: boolean;
    };
}

interface IActions {
    actions: {
        getWebshopCategories: (params: IGetWebshopCategoriesRequestParams) => void;
    };
}

class WebshopCategories extends React.PureComponent<IProps & IActions> {
    componentDidMount() {
        const { serviceId } = this.props;

        if (serviceId) {
            this.props.actions.getWebshopCategories({ serviceId });
        }
    }

    onAppChange = (option: IOption) => {
        this.props.actions.getWebshopCategories({ serviceId: String(option.id) });
    };

    onWebshopCategoryChange = () => {
        const { serviceId } = this.props;

        this.props.actions.getWebshopCategories({ serviceId });
    };

    render() {
        const { loaders } = this.props;

        return (
            <Container>
                <Title>Категории</Title>
                <Inner className="ml-xl mt-xl pb-xl">
                    <div className="mb-m inline align-items-center">
                        <div className="col-6">
                            <Apps locator="categories" onChange={this.onAppChange} />
                        </div>
                        {loaders.getWebshopCategories && (
                            <Loader className="ml-m" size="small" />
                        )}
                    </div>
                    <RequestStatus
                        errorConfig={{
                            showDetails: true,
                            className: 'text-align-left'
                        }}
                        className="mb-m"
                        routes={[
                            api.webshopCategories.getWebshopCategories
                        ]}
                    />
                    <WebshopCategory onChange={this.onWebshopCategoryChange } />
                </Inner>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    serviceId: state.appsOptions.selected.id as string
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getWebshopCategories
    }, dispatch)
});

const WebshopCategoriesWithConnect = connect(mapStateToProps, mapDispatchToProps)(WebshopCategories);

export default (props: IProps & IActions) => (
    <RequestTracker loaders={[
        api.webshopCategories.getWebshopCategories
    ]}>
        <WebshopCategoriesWithConnect {...props} />
    </RequestTracker>
);
