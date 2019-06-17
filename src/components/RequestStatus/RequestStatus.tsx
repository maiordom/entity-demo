import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IStore } from 'src/store';
import { TRoute } from 'src/routes/api';
import { IRequestJournal, IRequest } from 'src/entities/RequestJournal/store';
import { IRequestErrors, IError } from 'src/entities/RequestError/store';

import { Errors } from 'src/components/Form/Form';

type IProps = {
    requestJournal: IRequestJournal;
    requestErrors: IRequestErrors;
} & IOwnProps;

interface IOwnProps {
    errorConfig?: {
        showDetails?: boolean;
        className?: string;
    };
    route?: TRoute;
    routes?: Array<TRoute>;
    className?: string;
    render?: (request: IRequest, requestRoute: TRoute) => React.ReactNode;
}

interface IState {
    request: IRequest;
    status: null | 'pending' | 'resolved';
    requestRoute: TRoute;
}

class RequestStatus extends React.PureComponent<IProps & IOwnProps, IState> {
    state = {
        request: null,
        status: null,
        requestRoute: null
    };

    componentWillReceiveProps(nextProps: IProps) {
        const { requestJournal, requestErrors, routes, route } = nextProps;
        const { status } = this.state;

        let request;
        let error;
        let state;
        let requestRoute;

        (routes || [route]).forEach(route => {
            const requestObject = requestJournal[route.routeName];
            const errorObject = requestErrors[route.routeName];

            if (requestObject && !request) {
                request = requestObject;
                requestRoute = route;
            }

            if (errorObject && !error) {
                error = route;
            }
        });

        if (error) {
            state = { status: null, request: null, requestRoute: null };
        }

        if (status === 'resolved' && request && this.state.request !== request) {
            state = { status: 'pending', request, requestRoute };
        } else if (!status && request) {
            state = { status: 'pending', request, requestRoute };
        } else if (status === 'pending' && !request) {
            state = { status: 'resolved' };
        }

        if (state) {
            this.setState(state);
        }
    }

    render() {
        const { status, request, requestRoute } = this.state;
        const { render, className, errorConfig, routes } = this.props;
        const show = status === 'resolved';

        return (
            show && render
                ? <div className={classnames(
                    className,
                    'font-size-medium',
                    'line-height-s'
                )}>
                    {request && render(request, requestRoute)}
                </div>
                : routes
                    ? <Errors
                        {...errorConfig}
                        routes={routes}
                    />
                    : null
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    requestJournal: state.requestJournal,
    requestErrors: state.requestErrors
});

export default connect(mapStateToProps)(RequestStatus);
