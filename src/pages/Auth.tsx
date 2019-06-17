import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';

import clientRoutes from 'src/routes/client';

import { getProfile } from 'src/entities/User/actions';

import AuthForm from 'src/components/AuthForm/AuthForm';
import { Container } from 'src/components/Layout/Layout';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

import api from 'src/routes/api';

interface IActions {
    actions: {
        getProfile: () => Promise<void>;
    };
}

class AuthPage extends React.Component<RouteComponentProps<any> & IActions, any> {
    onAuthComplete = () => {
        this.props.actions.getProfile().then(() => {
            this.props.history.push(clientRoutes.general);
        });
    };

    render() {
        return (
            <Container center className="auth-page">
                <RequestTracker loaders={[ api.admin.connectToken ]}>
                    <AuthForm onAuthComplete={this.onAuthComplete} />
                </RequestTracker>
            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ getProfile }, dispatch)
});

export default withRouter(connect(null, mapDispatchToProps)(AuthPage));