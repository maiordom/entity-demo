import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from 'ui/lib/Button';
import Input from 'ui/lib/Input';
import Checkbox from 'ui/lib/Checkbox';
import { IRequest } from 'src/components/RequestTracker/RequestTracker';

import { signIn, ISignInRequestParams } from 'src/entities/User/actions';

import { Row, Field, Form, Error } from 'src/components/Form/Form';

import api from 'src/routes/api';

interface IProps {
    loaders: {
        connectToken: IRequest;
    };
    onAuthComplete: () => void;
}

interface IActions {
    actions: {
        signIn: (params: ISignInRequestParams) => Promise<void>;
    };
}

import soundFile from 'src/assets/sound/entity-demo-has-arrived.mp3';

const audio = new Audio(soundFile);

class AuthForm extends React.Component<IProps & IActions, any> {
    loginNodeKey: string = `login_${Math.random()}`;

    state = {
        username: '',
        password: ''
    };

    onSubmit = async (event) => {
        event.preventDefault();

        const { username, password } = this.state;

        await this.props.actions.signIn({ username, password });
        audio.play();
        this.props.onAuthComplete();
    };

    onUsernameChange = (username: string) => {
        this.setState({ username });
    }

    onPasswordChange = (password: string) => {
        this.setState({ password });
    }

    render() {
        const { loaders } = this.props;
        const { username, password } = this.state;

        return (
            <Form className="col-6 auth-form">
                <Row>
                    <Field>
                        <Input
                            locator="auth-form-login"
                            name={this.loginNodeKey}
                            onChange={this.onUsernameChange}
                            placeholder="Логин"
                            value={username}
                        />
                    </Field>
                </Row>
                <Row className="mt-s">
                    <Field>
                        <Input
                            locator="auth-form-password"
                            type="password"
                            onChange={this.onPasswordChange}
                            placeholder="Пароль"
                            value={password}
                        />
                    </Field>
                </Row>
                <Row>
                    <Checkbox
                        locator="auth-form-remember-me"
                        label="Запомнить меня"
                    />
                </Row>
                <Row className="mt-m">
                    <Button
                        locator="auth-form-auth-button"
                        type="submit"
                        isLoading={!!loaders.connectToken}
                        mods={['wide']}
                        onClick={this.onSubmit}
                    >
                        Войти
                    </Button>
                </Row>
                <Error className="mt-s" route={api.admin.connectToken} />
            </Form>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        signIn
    }, dispatch)
});

export default connect(null, mapDispatchToProps)(AuthForm);
