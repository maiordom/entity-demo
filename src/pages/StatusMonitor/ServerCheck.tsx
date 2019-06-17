import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from 'ui/lib/Button';
import Select from 'ui/lib/Select';
import Icon from 'ui/lib/Icon';

import { Form, Row, Field } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { IServerCheck, IServerTCPCheck, IServerHTTPCheck } from 'src/entities/StatusMonitor/models/ServerChecks';
import { ServerTCPCheckForm, ServerTCPCheck, IFormikServerTCPCheckValues } from './ServerTCPCheckForm';
import { ServerHTTPCheckForm, ServerHTTPCheck, IFormikServerHTTPCheckValues } from './ServerHTTPCheckForm';

import css from 'src/components/Overlay/Overlay.css';

export interface IProps {
    type: string;
    title: string;
    actionTitle: string;
    serverCheck?: IServerCheck;
    onServerCheckCreate: (serverCheck: IServerCheck) => void;
    onServerCheckEdit: (oldServerCheck: IServerCheck, newServerCheck: IServerCheck) => void;
    onServerCheckRemove: (serverCheck: IServerCheck) => void;
}

export interface IState {
    checkType: string;
}

const checkTypes = [
    { id: 'tcp', value: 'tcp' },
    { id: 'http', value: 'http' }
];

export default class ServerCheck extends React.Component<IProps, IState> {
    formikServerTCPCheckRef: React.RefObject<ServerTCPCheck> = React.createRef();
    formikServerHTTPCheckRef: React.RefObject<ServerHTTPCheck> = React.createRef();

    state = {
        checkType: this.props.serverCheck ? this.props.serverCheck.type : 'tcp'
    };

    onSubmit = () => {
        const { checkType } = this.state;

        switch (checkType) {
            case 'tcp': this.formikServerTCPCheckRef.current.submitForm(); break;
            case 'http': this.formikServerHTTPCheckRef.current.submitForm(); break;
        }
    };

    handleSubmit = (values: IServerCheck) => {
        switch (this.props.type) {
            case 'create': this.props.onServerCheckCreate(values); break;
            case 'edit': this.props.onServerCheckEdit(this.props.serverCheck, values); break;
        }
    };

    onFormikServerTCPCheckSubmit = (values: IFormikServerTCPCheckValues) => {
        this.handleSubmit(values);
    };

    onFormikServerHTTPCheckSubmit = (values: IFormikServerHTTPCheckValues) => {
        this.handleSubmit(values);
    };

    onCheckTypeChange = (value: string) => {
        this.setState({ checkType: value });
    };

    onRemoveClick = () => {
        this.props.onServerCheckRemove(this.props.serverCheck);
    };

    render() {
        const { title, actionTitle, serverCheck, type } = this.props;
        const { checkType } = this.state;
        let form = null;

        switch (checkType) {
            case 'tcp': form = <ServerTCPCheckForm
                innerRef={this.formikServerTCPCheckRef}
                values={{
                    type: 'tcp',
                    name: serverCheck ? serverCheck.name : '',
                    host: serverCheck ? (serverCheck as IServerTCPCheck).host : '',
                    port: serverCheck ? (serverCheck as IServerTCPCheck).port : ''
                }}
                onSubmit={this.onFormikServerTCPCheckSubmit}
            />; break;

            case 'http': form = <ServerHTTPCheckForm
                innerRef={this.formikServerHTTPCheckRef}
                values={{
                    type: 'http',
                    name: serverCheck ? serverCheck.name : '',
                    url: serverCheck ? (serverCheck as IServerHTTPCheck).url : '',
                    host: serverCheck ? (serverCheck as IServerHTTPCheck).host : '',
                    method: serverCheck ? (serverCheck as IServerHTTPCheck).method : ''
                }}
                onSubmit={this.onFormikServerHTTPCheckSubmit}
            />; break;
        }

        return (
            <div className={classNames(
                css.container,
                'pl-l',
                'pt-xl'
            )}>
                <div className="font-size-large">{title}</div>
                <Form className="col-6 mt-m">
                    <Row>
                        <Field>
                            <Select
                                title="Тип проверки"
                                placeholder="Выберите тип"
                                theme="light"
                                options={checkTypes}
                                onChange={this.onCheckTypeChange}
                                value={checkType}
                            />
                        </Field>
                    </Row>
                    {form}
                </Form>
                <div className={`${css.panel} justify-content-space-between`}>
                    <Button
                        onClick={this.onSubmit}
                        className="col-6"
                    >
                        {actionTitle}
                    </Button>
                    {type === 'edit' && (
                        <Button
                            onClick={this.onRemoveClick}
                            className="remove-button"
                            theme="thin-black"
                        >
                            <Icon
                                className="remove-button-icon"
                                name="cross"
                            />
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}
