import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from 'ui/lib/Button';

import { IStore } from 'src/store';
import { Container, Title, Inner } from 'src/components/Layout/Layout';

import getUsersGroups, { IGetUsersGroupsRequestParams, IGetUsersGroupsResult } from 'src/entities/UsersGroups/services/GetUsersGroups';
import addUsersGroup, { IAddUsersGroupRequestParams, IAddUsersGroupResult } from 'src/entities/UsersGroups/services/AddUsersGroup';
import addUsersToGroup, { IAddUsersToGroupRequestParams } from 'src/entities/UsersGroups/services/AddUsersToGroup';
import editUsersGroup, { IEditUsersGroupRequestParams } from 'src/entities/UsersGroups/services/EditUsersGroup';
import { setUsersGroup, ISetUsersGroupParams } from 'src/entities/UsersGroups/actions';
import { setUsersGroups, ISetUsersGroupsParams } from 'src/entities/UsersGroups/actions';
import { deleteUsersGroup, IDeleteUsersGroupParams } from 'src/entities/UsersGroups/actions';

import Apps, { IOption } from 'src/components/Apps/Apps';
import { IUsersGroups, IUsersGroup } from 'src/entities/UsersGroups/store';
import Overlay from 'src/components/Overlay/Overlay';
import UsersGroupManager from 'src/components/UsersGroupManager/UsersGroupManager';
import RequestTracker, { IRequest } from 'src/components/RequestTracker/RequestTracker';
import Table from 'src/components/Table/Table';
import Loader from 'ui/lib/Loader';
import TableControls from 'src/components/UsersGroupManager/TableControls';

import api from 'src/routes/api';

interface IProps {
    app: IOption;
    usersGroups: IUsersGroups;
    loaders: {
        getUsersGroups: IRequest;
    };
}

interface IActions {
    actions: {
        editUsersGroup: (params: IEditUsersGroupRequestParams) => void;
        deleteUsersGroup: (params: IDeleteUsersGroupParams) => void;
        addUsersToGroup: (params: IAddUsersToGroupRequestParams) => Promise<void>;
        setUsersGroup: (params: ISetUsersGroupParams) => void;
        setUsersGroups: (params: ISetUsersGroupsParams) => void;
        getUsersGroups: (params: IGetUsersGroupsRequestParams) => Promise<IGetUsersGroupsResult>;
        addUsersGroup: (params: IAddUsersGroupRequestParams) => Promise<IAddUsersGroupResult>;
    };
}

interface IState {
    selectedGroup?: IUsersGroup;
}

class UsersGroupesPage extends React.PureComponent<IProps & IActions, IState> {
    state = {
        selectedGroup: null
    };

    componentDidMount() {
        const { app } = this.props;

        if (app.id) {
            this.fetchUsersGroups({ serviceId: String(app.id) });
        }
    }

    overlayRef: React.RefObject<Overlay> = React.createRef();

    onAppChange = (app: IOption) => {
        this.fetchUsersGroups({ serviceId: String(app.id) });
    };

    fetchUsersGroups = async (params: IGetUsersGroupsRequestParams) => {
        const usersGroups = await this.props.actions.getUsersGroups(params);

        this.props.actions.setUsersGroups({
            groups: usersGroups,
            serviceId: params.serviceId
        });
    };

    onAddGroupClick = () => {
        this.overlayRef.current.toggleVisibility(true);
    };

    onOverlayChange = (state: boolean) => {
        if (!state) {
            this.setState({
                selectedGroup: null
            });
        }
    };

    onUsersGroupClick = (item: IUsersGroup) => {
        this.setState({ selectedGroup: item }, () => {
            this.overlayRef.current.toggleVisibility(true);
        });
    };

    renderRowControls = (item: IUsersGroup): React.ReactNode => {
        return (
            <TableControls
                data={item}
                onUsersGroupClick={this.onUsersGroupClick}
                onUsersGroupDeleted={this.onUsersGroupDeleted}
            />
        );
    };

    onUsersGroupDeleted = (usersGroup: IUsersGroup) => {
        this.props.actions.deleteUsersGroup({
            group: usersGroup,
            serviceId: String(this.props.app.id)
        });
    };

    get usersGroups() {
        const { usersGroups } = this.props;
        const hasUsersGroups = usersGroups && usersGroups.length > 0;

        if (!usersGroups) {
            return null;
        }

        if (hasUsersGroups) {
            return (<>
                <Table
                    className="mt-l"
                    data={usersGroups as any}
                    locator="user-groups"
                    rowControls={this.renderRowControls}
                    columns={[
                        { text: 'ID', field: 'id' },
                        { text: 'Название', field: 'name' },
                        { text: 'Описание', field: 'description' },
                        { text: 'Дата изменения', field: 'whenModified' },
                        { text: 'Количество пользователей', field: 'size' },
                    ]}
                />
                <Button
                    locator="add-group-button"
                    className="mt-xl"
                    onClick={this.onAddGroupClick}
                >
                    Добавить группу
                </Button>
            </>);
        } else {
            return (
                <Button
                    locator="add-group-button"
                    className="mt-xl"
                    onClick={this.onAddGroupClick}
                >
                    Добавить группу
                </Button>
            );
        }
    }

    onUsersGroupAdd = async ({ name, description, users }: IUsersGroup) => {
        const serviceId = String(this.props.app.id);
        const usersGroup = await this.props.actions.addUsersGroup({
            name,
            description,
            users: [],
            serviceId
        });

        const size = await this.addUsersToGroup(usersGroup.id, users);

        usersGroup.size = size;

        this.props.actions.setUsersGroup({
            group: usersGroup,
            serviceId
        });
    };

    onUsersGroupEdit = async ({ id, name, description, users, serviceId }: IUsersGroup, action: string) => {
        if (action === 'add') {
            await this.addUsersToGroup(id, users);
        } else {
            await this.props.actions.editUsersGroup({
                id, name, description, users: [ ...users.splice(0, 1) ], serviceId
            });
            await this.addUsersToGroup(id, users);
        }

        this.fetchUsersGroups({ serviceId });
    };

    addUsersToGroup = async (groupId: number, users: Array<string>) => {
        const USERS_GROUP_CHUNK = 100000;
        const promises = [];
        let size = 0;

        while (users.length) {
            const chunk = users.splice(0, USERS_GROUP_CHUNK).filter(userId => userId);
            size += chunk.length;

            promises.push(() =>
                this.props.actions.addUsersToGroup({
                    groupId,
                    userIds: chunk
                })
            );
        }

        for (const promise of promises) {
            await promise();
        }

        return Promise.resolve(size);
    };

    render() {
        const { loaders } = this.props;
        const { selectedGroup } = this.state;
        const { usersGroups } = this;

        return (
            <Container>
                <Title>Группы пользователей</Title>
                <Inner className="mt-xl pb-xl ml-xl">
                    <div className=" inline align-items-center">
                        <div className="col-6">
                            <Apps locator="groups" onChange={this.onAppChange} />
                        </div>
                        {loaders.getUsersGroups && (
                            <Loader className="ml-m" size="small" />
                        )}
                    </div>
                    {usersGroups}
                </Inner>
                <Overlay
                    ref={this.overlayRef}
                    onChange={this.onOverlayChange}
                >
                    {selectedGroup
                        ? <RequestTracker loaders={[
                            { ...api.groupManager.addUsersToGroup, alias: 'action' }
                        ]}>
                            <UsersGroupManager
                                type="edit"
                                group={selectedGroup}
                                onSubmit={this.onUsersGroupEdit}
                                actionTitle="Сохранить изменения"
                                title="Редактирование группы пользователей"
                            />
                        </RequestTracker>
                        : <RequestTracker loaders={[
                            { ...api.groupManager.addUsersGroup, alias: 'action' },
                            { ...api.groupManager.addUsersToGroup, alias: 'action' }
                        ]}>
                            <UsersGroupManager
                                group={selectedGroup}
                                type="create"
                                onSubmit={this.onUsersGroupAdd}
                                actionTitle="Создать группу"
                                title="Создание группы пользователей"
                            />
                        </RequestTracker>
                    }
                </Overlay>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    app: state.appsOptions.selected,
    usersGroups: state.usersGroups[state.appsOptions.selected.id]
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        getUsersGroups,
        addUsersGroup,
        addUsersToGroup,
        editUsersGroup,
        ...bindActionCreators({
            setUsersGroup,
            setUsersGroups,
            deleteUsersGroup
        }, dispatch)    
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersGroupesPage);