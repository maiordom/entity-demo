import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { IStore } from 'src/store';
import { TRoute } from 'src/routes/api';
import { IRequestErrors } from 'src/entities/RequestError/store';
import { removeError, IRemoveErrorParams } from 'src/entities/RequestError/actions';
import { Error } from './Error';

interface IProps {
    showDetails?: boolean;
    requestErrors: IRequestErrors;
    routes: Array<TRoute>;
    className?: string;
}

interface IActions {
    actions: {
        removeError: (params: IRemoveErrorParams) => void;
    }
}

import css from './Form.css';

class ErrorsComponent extends React.PureComponent<IProps & IActions, any> {
    componentWillUnmount() {
        this.props.routes.forEach(route => {
            this.props.actions.removeError({ name: route.routeName });
        });
    }

    render() {
        const { className, routes, requestErrors, showDetails } = this.props;
        let currentRoute;

        routes.forEach(route => {
            const errorObject = requestErrors[route.routeName];

            if (errorObject && !currentRoute) {
                currentRoute = route;
            }
        });

        if (!currentRoute) {
            return null;
        }

        return (
            <Error
                showDetails={showDetails}
                className={className}
                route={currentRoute}
            />
        );
    }
}

const mapStateToProps = (state: IStore, ownProps: IProps) => ({
    routes: ownProps.routes,
    requestErrors: state.requestErrors
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ removeError }, dispatch)
});

export const Errors = connect(mapStateToProps, mapDispatchToProps)(ErrorsComponent);
