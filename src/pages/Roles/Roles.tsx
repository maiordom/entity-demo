import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { Form, Row, Errors } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import Panel from 'src/components/Panel/Panel';

import { getUserRoles, IGetUserRolesRequestParams } from 'src/entities/Roles/actions';
import { setServices } from 'src/entities/Roles/actions';
import { applyUserRoles } from 'src/entities/Roles/actions';
import { getRoles } from 'src/entities/Roles/actions';

import { IStore } from 'src/store';
import { IProfile, IPermissions } from 'src/entities/User/store';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import RolesList from './RolesList';

interface IProps {
    profile: IProfile;
    permissions: IPermissions;
    loaders?: {
        addUserRole: boolean;
        deleteUserRole: boolean;
        getUserRoles: boolean;
    };
}

interface IActions {
    actions: {
        getUserRoles: (params: IGetUserRolesRequestParams) => Promise<void>;
        setServices: () => void;
        applyUserRoles: () => void;
        getRoles: () => void;
    };
}

import api from 'src/routes/api';

class RolesComponent extends React.PureComponent<IProps & IActions, {}> {
    searchUserByIdInputRef: React.RefObject<Input<any>> = React.createRef();

    async componentDidMount() {
        await this.props.actions.getRoles();
        await this.props.actions.getUserRoles({ userId: this.props.profile.userId });
        this.props.actions.setServices();
    }

    onSetRolesClick = () => {
        this.props.actions.applyUserRoles();
    };

    onSearchUserByIdClick = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const userId = this.searchUserByIdInputRef.current.getValue();

        this.props.actions.getUserRoles({ userId }).then(() => {
            this.props.actions.setServices();
        });

        event.preventDefault();
    };

    render() {
        const { loaders, permissions } = this.props;

        return (
            <Container>
                <Title>Роли</Title>
                <Inner className="mt-xl pb-xxl ml-xl">
                    <Form>
                        <Row className="align-items-flex-end">
                            <Input
                                locator="roles-search-input"
                                ref={this.searchUserByIdInputRef}
                                label="Поиск пользователя по userId, например 120238808"
                                placeholder="Укажи userId"
                                theme="light"
                            />
                            <Button
                                locator="roles-search-button"
                                isLoading={loaders.getUserRoles}
                                onClick={this.onSearchUserByIdClick}
                                className="ml-m col-3"
                                mods={['size-medium', 'font-size-medium']}
                                type="submit"
                            >
                                Найти
                            </Button>
                        </Row>
                        <Errors className="text-align-left mt-m" routes={[
                            api.roles.getUserRoles,
                            api.roles.getRoles
                        ]} />                       
                    </Form>
                    {'auth.read.roles' in permissions && (
                        <div className="mt-l">
                            <RolesList />
                        </div>
                    )}
                </Inner>
                {'auth.read.roles' in permissions &&
                'auth.write.roles' in permissions && (
                    <Panel>
                        <Button
                            locator="add-roles-button"
                            isLoading={loaders.addUserRole || loaders.deleteUserRole}
                            className="col-7"
                            onClick={this.onSetRolesClick}
                        >
                            Выдать роли
                        </Button>
                        <Errors className="ml-s" routes={[
                            api.roles.addUserRole,
                            api.roles.deleteUserRole
                        ]} />
                    </Panel>
                )}
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    profile: state.user.profile,
    permissions: state.user.permissions
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getUserRoles,
        setServices,
        applyUserRoles,
        getRoles
    }, dispatch)
});

const Roles = connect(mapStateToProps, mapDispatchToProps)(RolesComponent);

export default (props: IProps & IActions) => (
    <RequestTracker loaders={[
        api.roles.getUserRoles,
        api.roles.addUserRole,
        api.roles.deleteUserRole
    ]}>
        <Roles {...props} />
    </RequestTracker>
);
