import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import Icon from 'ui/lib/Icon';
import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import RadioGroup from 'ui/lib/RadioGroup';

import { Form, Row, Field, Inline } from 'src/components/Form/Form';
import { IServerChecks, ICheckMode } from 'src/entities/StatusMonitor/models/ServerChecks';
import { IServiceStatuses } from 'src/entities/StatusMonitor/store';
import { editServer, IEditServerParams } from 'src/entities/StatusMonitor/actions';
import { removeServer, IRemoveServerParams } from 'src/entities/StatusMonitor/actions';

interface IProps {
    serviceStatuses: IServiceStatuses;
    serverChecks: IServerChecks;
}

interface IActions {
    actions: {
        editServer: (params: IEditServerParams) => void;
        removeServer: (params: IRemoveServerParams) => void;
    };
}

interface IState {
    isActive: boolean;
    checkMode: ICheckMode;
}

interface IFormikServerMananagerValues {
    name: string;
    checkMode: ICheckMode;
}

class FormikServerManager extends Formik<{}, IFormikServerMananagerValues> {}

class ServerManager extends React.PureComponent<IProps & IActions, IState> {
    state = {
        isActive: false,
        checkMode: this.props.serverChecks.checkMode,
        checkModeOptions: [{
            text: 'auto',
            value: 'auto',
            selected: false
        }, {
            text: 'on',
            value: 'on',
            selected: false
        }, {
            text: 'off',
            value: 'off',
            selected: false
        }].map(option => {
            if (option.value === this.props.serverChecks.checkMode) {
                option.selected = true;
            }

            return option;
        })
    };

    onControlClick = () => {
        this.toggle();
    };

    toggle() {
        this.setState({ isActive: !this.state.isActive });
    }

    onSubmit = (values: IFormikServerMananagerValues) => {
        this.setServerChecksChanges(values);
        this.toggle();
    };

    onCancel = () => {
        this.toggle();
    };

    onRemove = () => {
        const { serviceStatuses: { environment, serviceId } } = this.props;
        const { serverChecks } = this.props;

        this.props.actions.removeServer({
            serverChecks,
            environment,
            serviceId
        });

        this.toggle();
    };

    setServerChecksChanges = (changes: IFormikServerMananagerValues) => {
        const { serviceStatuses: { environment, serviceId } } = this.props;
        const { serverChecks } = this.props;

        this.props.actions.editServer({
            serviceId,
            serverChecks,
            environment,
            changes
        });
    };

    render() {
        const { children, serverChecks } = this.props;
        const { isActive, checkModeOptions } = this.state;

        return (
            !isActive ? (
                <div
                    onClick={this.onControlClick}
                    className="inline align-items-center"
                >
                    {children}
                    <Icon
                        name="tool"
                        wrapperClassName="ml-xxs button-icon"
                    />
                </div>
            ) : <FormikServerManager
                initialValues={{
                    name: serverChecks.name,
                    checkMode: serverChecks.checkMode
                }}
                validationSchema={yup.object().shape({
                    name: yup.string().required('Необходимо указать название сервера'),
                })}          
                onSubmit={this.onSubmit}
                render={({ handleSubmit, errors, values, setFieldValue }) => (
                    <Form>
                        <Row className="col-6">
                            <Field>
                                <Input
                                    status={errors.name ? 'error' : null}
                                    hint={errors.name && String(errors.name)}
                                    label="Название сервера"
                                    placeholder="Укажи название сервера"
                                    onChange={(name: string) => {
                                        setFieldValue('name', name);
                                    }}
                                    theme="light"
                                    value={values.name}
                                    autoFocus
                                />
                            </Field>
                        </Row>
                        <Row col>
                            <div className="label">Тип проверки</div>
                            <RadioGroup
                                className="mb-m"
                                theme="light"
                                onClick={(checkMode: ICheckMode) => {
                                    setFieldValue('checkMode', checkMode);
                                }}
                                data={checkModeOptions}
                            />
                        </Row>
                        <Inline>
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                theme="thin-black"
                                mods={['size-small', 'font-size-small']}
                            >
                                Сохранить
                            </Button>
                            <Button
                                onClick={this.onCancel}
                                theme="thin-black"
                                mods={['size-small', 'font-size-small']}
                                className="ml-s"
                            >
                                Отменить
                            </Button>
                            <Button
                                onClick={this.onRemove}
                                theme="thin-black"
                                mods={['size-small', 'font-size-small']}
                                className="ml-s"
                            >
                                Удалить
                            </Button>
                        </Inline>
                    </Form>
                )}
            />
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        editServer,
        removeServer
    }, dispatch)
});

export default connect(null, mapDispatchToProps)(ServerManager);
