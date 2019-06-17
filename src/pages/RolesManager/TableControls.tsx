import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router';

import Button from 'ui/lib/Button';
import Loader from 'ui/lib/Loader';
import RequestTracker, { IRequest } from 'src/components/RequestTracker/RequestTracker';

import { IRole } from 'src/entities/Roles/store';

import api from 'src/routes/api';
import clientRoutes from 'src/routes/client';

interface IExternalProps {
    role: IRole;
    onEditRole: (role: IRole) => void;
    onDeleteRole: (role: IRole) => void;
}

export interface IProps {
    loaders?: {
        getRoleClaims: boolean;
        deleteRole: IRequest;
    };
}

class TableControlsComponent extends React.PureComponent<IProps & IExternalProps & RouteComponentProps<any>, any> {
    onEditRoleClick = () => {
        this.props.onEditRole(this.props.role);
    };

    onDeleteRoleClick = () => {
        this.props.onDeleteRole(this.props.role);
    };

    render() {
        const { loaders, role } = this.props;

        return (
            <div className="inline">
                <div className="col-3 align-items-center inline justify-content-center">
                    {loaders.getRoleClaims
                        ? <Loader size="small" className="inline-flex" />
                        : <Button
                            onClick={this.onEditRoleClick}
                            theme="thin-black"
                            mods={['wide', 'size-small', 'font-size-small']}
                        >
                            Редактировать
                        </Button>
                    }
                </div>
                <div className="col-2 ml-s align-items-center inline justify-content-center">
                    {loaders.deleteRole && loaders.deleteRole.params.roleName === role.name
                        ? <Loader size="small" className="inline-flex" />
                        : <Button
                            onClick={this.onDeleteRoleClick}
                            theme="thin-black"
                            mods={['wide', 'size-small', 'font-size-small']}
                        >
                            Удалить
                        </Button>
                    }
                </div>
            </div>
        );
    }
}

const TableControls = withRouter(TableControlsComponent);

export default (props: IExternalProps & IProps) =>
    <RequestTracker loaders={[ api.roles.deleteRole ]}>
        <TableControls {...props} />
    </RequestTracker>