import React from 'react';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import RadioGroup, { IData } from 'ui/lib/RadioGroup';

import UploadButton from 'src/components/UploadButton/UploadButton';
import { Form, Row, Field } from 'src/components/Form/Form';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';

import { IUsersGroup } from 'src/entities/UsersGroups/store';

import css from './UsersGroupManager.css';

interface IProps {
    type: string;
    group?: IUsersGroup;
    title: string;
    actionTitle: string;
    onSubmit: (group: IUsersGroup, action: string) => void;
    loaders?: {
        action: boolean;
    };
}

const usersAction = [{
    text: 'Список пользователей',
    value: 'new',
    selected: true,
}, {
    text: 'Добавить в группу',
    value: 'add'
}];

type IState = IUsersGroup;

import api from 'src/routes/api';

export default class UsersGroupManager extends React.PureComponent<IProps, IState> {
    state = this.props.group || {} as IUsersGroup;
    usersAction: Array<IData> = usersAction;
    selectedUsersAction: string = 'new';

    onUsersListChange = (file: File) => {
        const reader = new FileReader();

        reader.onload = (fileEntity) => {
            this.setState({ users: fileEntity.target.result.split('\n') });
            this.forceUpdate();
        };
        reader.readAsText(file);
    };

    onNameChange = (name: string) => {
        this.setState({ name });
    };

    onDescriptionChange = (description: string) => {
        this.setState({ description });
    };

    onCreate = () => {
        const { state, selectedUsersAction } = this;

        this.props.onSubmit(
            state,
            selectedUsersAction
        );
    };

    onEdit = () => {
        const { state, selectedUsersAction } = this;

        this.props.onSubmit(
            state,
            selectedUsersAction
        );
    };

    onUsersActionChange = (value: string) => {
        this.selectedUsersAction = value;
    };

    render() {
        const {
            actionTitle,
            title,
            loaders,
            type
        } = this.props;
        const { name, description, users } = this.state;

        return (
            <div className={css.container}>
                <div className={css.title}>{title}</div>
                <Form className="col-6 mt-m ml-l">
                    <Row>
                        <Field>
                            <Input
                                disabled={type ==='edit'}
                                onChange={this.onNameChange}
                                locator="user-group-title"
                                label="Название"
                                placeholder="Название"
                                theme="light"
                                value={name}
                            />
                        </Field>
                    </Row>
                    <Row>
                        <Field>
                            <Input
                                disabled={type ==='edit'}
                                onChange={this.onDescriptionChange}
                                locator="user-group-description"
                                label="Описание"
                                placeholder="Описание"
                                theme="light"
                                value={description}
                            />
                        </Field>
                    </Row>
                    <Row>
                        <Field>
                            <UploadButton
                                title="Выбрать файл с пользователями"
                                displayFileName={false}
                                locator="user-list-upload-button"
                                onChange={this.onUsersListChange}
                            />
                        </Field>
                    </Row>
                    {users && type === 'edit' && (
                        <Row>
                            <RadioGroup
                                data={this.usersAction}
                                theme="light"
                                onClick={this.onUsersActionChange}
                                mods={['direction-column']}
                            />
                        </Row>
                    )}
                    <Row className="mt-xl">
                        <Button
                            disabled={users === undefined}
                            locator="save-button"
                            isLoading={loaders.action}
                            onClick={type === 'create'
                                ? this.onCreate
                                : this.onEdit
                            }
                            mods={['wide']}
                        >
                            {actionTitle}
                        </Button>
                    </Row>
                    <RequestStatus
                        errorConfig={{
                            showDetails: true,
                            className: 'mt-s text-align-left'
                        }}
                        routes={[
                            api.groupManager.addUsersGroup,
                            api.groupManager.addUsersToGroup
                        ]}
                    />
                </Form>
            </div>
        );
    }
}
