import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loader from 'ui/lib/Loader';
import Button from 'ui/lib/Button';

import { getRoles } from 'src/entities/Roles/actions';
import { addRole, IAddRoleParams } from 'src/entities/Roles/actions';
import { editRole, IEditRoleParams } from 'src/entities/Roles/actions';
import { deleteRole, IDeleteRoleRequestParams } from 'src/entities/Roles/actions';
import { setClaims, ISetClaimsParams } from 'src/entities/Claim/actions';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { Container, Title, Inner } from 'src/components/Layout/Layout';
import Table from 'src/components/Table/Table';
import { Errors } from 'src/components/Form/Form';
import TableControls from './TableControls';
import Overlay from 'src/components/Overlay/Overlay';
import RoleManager, { IFormikRoleManagerValues } from './RoleManager';

import { IStore } from 'src/store';
import { IPermissions } from 'src/entities/User/store';
import { IRoles, IRole } from 'src/entities/Roles/store';

import api from 'src/routes/api';

interface IProps {
    permissions: IPermissions;
    roles: IRoles;
    loaders: {
        getRoles: boolean;
        addRole: boolean;
        editRole: boolean;
    }
}

interface IState {
    role: IRole;
}

interface IActions {
    actions: {
        editRole: (params: IEditRoleParams) => Promise<void>;
        getRoles: () => void;
        addRole: (params: IAddRoleParams) => Promise<void>;
        setClaims: (params: ISetClaimsParams) => void;
        deleteRole: (params: IDeleteRoleRequestParams) => Promise<void>;
    };
}

class RolesManagerComponent extends React.PureComponent<IProps & IActions, IState> {
    state = {
        role: { name: null, claims: [] }
    };

    overlayRef: React.RefObject<Overlay> = React.createRef();
    overlayEditRoleRef: React.RefObject<Overlay> = React.createRef();

    componentDidMount() {
        this.props.actions.getRoles();
    }

    onEditRole = (role: IRole) => {
        const { roleService } = this.props.roles;

        this.setState({ role }, () => {
            const claims = role.claims.map(claim => ({
                type: claim,
                value: roleService
            }));
            this.props.actions.setClaims({ claims, userId: null });
            this.overlayEditRoleRef.current.toggleVisibility(true);
        });
    };

    onDeleteRole = (role: IRole) => {
        this.props.actions.deleteRole({ roleId: String(role.id) }).then(() => {
            this.props.actions.getRoles();
        });
    };

    renderRowControls = (role: IRole) =>
        <TableControls
            onDeleteRole={this.onDeleteRole}
            onEditRole={this.onEditRole}
            role={role}
        />;

    onAddRoleClick = () => {
        this.overlayRef.current.toggleVisibility(true);
    };

    onAddRoleSubmit = (params: IFormikRoleManagerValues) => {
        this.props.actions.addRole(params).then(() => {
            this.props.actions.getRoles();
            this.setState({ role: { name: null, claims: [] } });
            this.props.actions.setClaims({ claims: [], userId: null });
            this.hideOverlay();
        });
    };

    onEditRoleSubmit = (params: IFormikRoleManagerValues, role: IRole) => {
        this.props.actions.editRole({ id: role.id, name: params.roleName }).then(() => {
            this.props.actions.getRoles();
            this.setState({ role: { name: null, claims: [] } });
            this.props.actions.setClaims({ claims: [], userId: null });
            this.hideOverlay();
        });
    };

    hideOverlay() {
        this.overlayRef.current.toggleVisibility();
        this.overlayEditRoleRef.current.toggleVisibility();
    }

    onOverlayChange = (isVisible: boolean) => {
        if (!isVisible) {
            this.props.actions.setClaims({ claims: [], userId: null });
        }
    };

    get roles() {
        const { roles, permissions } = this.props;
        const hasRoles = roles && roles.rolesList && roles.rolesList.length > 0;

        if (roles && !roles.rolesList) {
            return null;
        }

        return (<>
            {hasRoles && <Table
                className="mb-xl"
                data={roles.rolesList as any}
                locator="roles"
                rowControls={this.renderRowControls}
                columns={[
                    { text: 'ID', field: 'id' },
                    { text: 'Название роли', field: 'name' }
                ]}
            />}
            {'auth.write.roles' in permissions && (
                <Button
                    locator="add-role-button"
                    onClick={this.onAddRoleClick}
                >
                    Добавить роль
                </Button>
            )}
        </>);
    }

    render() {
        const { loaders } = this.props;
        const { role } = this.state;
        const { roles } = this;

        return (
            <Container>
                <Title>
                    Менеджер ролей
                    {loaders.getRoles && (
                        <Loader className="ml-m" size="small" />
                    )}
                </Title>
                <Errors
                    className="text-align-left mt-m"
                    routes={[ api.roles.getRoles ]}
                />
                <Inner className="mt-xl pb-xl ml-xl">
                    {roles}
                </Inner>
                <Overlay ref={this.overlayRef} onChange={this.onOverlayChange}>
                    <RoleManager
                        locator="add-role"
                        routeName="addRole"
                        isLoading={loaders.addRole}
                        title="Создать роль"
                        actionTitle="Сохранить"
                        onSubmit={this.onAddRoleSubmit}
                    />
                </Overlay>
                <Overlay ref={this.overlayEditRoleRef} onChange={this.onOverlayChange}>
                    <RoleManager
                        locator="edit-role"
                        routeName="editRole"
                        isLoading={loaders.editRole}
                        role={role}
                        title="Редактировать роль"
                        actionTitle="Сохранить изменения"
                        onSubmit={this.onEditRoleSubmit}
                    />
                </Overlay>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    roles: state.roles,
    permissions: state.user.permissions
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getRoles,
        editRole,
        addRole,
        setClaims,
        deleteRole
    }, dispatch)
});

const RolesManagerPage = connect(mapStateToProps, mapDispatchToProps)(RolesManagerComponent);

export default (props: IProps & IActions) =>
    <RequestTracker loaders={[
        api.roles.getRoles,
        api.roles.addRole,
        api.roles.editRole
    ]}>
        <RolesManagerPage {...props} />
    </RequestTracker>;
