import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Button from 'ui/lib/Button';
import Input from 'ui/lib/Input';
import RadioGroup from 'ui/lib/RadioGroup';

import { Form } from 'src/components/Form/Form';

interface IState {
    isActive: boolean;
    checkMode: string;
}

interface IProps {
    actionTitle: string;
    onValueSet: (value: string, checkMode: string) => void;
}

interface IFormikServerCreateValues {
    serverName: string;
}

class FormikServerCreate extends Formik<{}, IFormikServerCreateValues> {}

export default class ServerCreate extends React.PureComponent<IProps, IState> {
    state = {
        isActive: false,
        checkMode: 'auto',
        checkModeOptions: [{
            text: 'auto',
            value: 'auto',
            selected: true
        }, {
            text: 'on',
            value: 'on'
        }, {
            text: 'off',
            value: 'off'
        }]
    };

    onSetClick = () => {
        this.setState({ isActive: true });
    };

    onSubmit = (values: IFormikServerCreateValues) => {
        const { checkMode } = this.state;
        const { serverName } = values;

        this.setState({ isActive: false }, () => {
            this.props.onValueSet(serverName, checkMode);
        });
    };

    onCancel = () => {
        this.setState({ isActive: false });
    };

    onCheckModeClick = (value: string) => {
        this.setState({ checkMode: value });
    };

    render() {
        const { isActive, checkModeOptions } = this.state;
        const { actionTitle } = this.props;

        return (<>
            {isActive && (
                <FormikServerCreate
                    initialValues={{
                        serverName: ''
                    }}
                    validationSchema={yup.object().shape({
                        serverName: yup.string().required('Необходимо указать имя'),
                    })}          
                    onSubmit={this.onSubmit}
                    render={({ handleSubmit, values, errors, setFieldValue }) => (<Form>
                        <Input
                            autoFocus
                            status={errors.serverName ? 'error' : null}
                            hint={errors.serverName && String(errors.serverName)}
                            label="Название сервера"
                            className="col-6 mb-m"
                            placeholder="Укажите название"
                            theme="light"
                            value={values.serverName}
                            onChange={(serverName: string) => {
                                setFieldValue('serverName', serverName);
                            }}
                        />
                        <div className="label">Тип проверки</div>
                        <RadioGroup
                            className="mb-m"
                            onClick={this.onCheckModeClick}
                            theme="light"
                            data={checkModeOptions}
                        />
                        <div className="inline">
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                theme="thin-black"
                                mods={['size-small', 'font-size-small']}                
                            >
                                Создать
                            </Button>
                            <Button
                                onClick={this.onCancel}
                                className="ml-s"
                                theme="thin-black"
                                mods={['size-small', 'font-size-small']}
                            >
                                Отменить
                            </Button>
                        </div>
                    </Form>)}
                >
                </FormikServerCreate>
            )}
            {!isActive && (
                <Button
                    onClick={this.onSetClick}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    {actionTitle}
                </Button>
            )}
        </>);
    }
}
