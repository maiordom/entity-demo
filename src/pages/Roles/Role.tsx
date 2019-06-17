import React from 'react';
import classNames from 'classnames';
import map from 'lodash/map';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IRole } from 'src/entities/Roles/models/Role';
import { IUserRoles } from 'src/entities/Roles/models/UserRoles';

import { setRole, ISetRoleParams } from 'src/entities/Roles/actions';

import Checkbox from 'ui/lib/Checkbox';

import css from './Role.css';

interface IProps {
    role: IRole;
    userRolesByService: IUserRoles;
    userRolesByType: IUserRoles;
}

interface IActions {
    actions: {
        setRole: (params: ISetRoleParams) => void;
    };
}

class Role extends React.PureComponent<IProps & IActions, any> {
    onRoleClick = (checked: boolean, serviceKey: string, role: string) => {
        this.props.actions.setRole({ checked, serviceKey, role });
    };

    render() {
        const { role, userRolesByService, userRolesByType } = this.props;

        return (
            <div data-locator={`role-container-${role.name}`} className={css.container}>
                <div className={`${css.inner} col inline-flex`}>
                    <div className={classNames(css.line, 'inline')}>
                        <div className={css.title}>{role.name}</div>
                        {map(userRolesByService, (serviceRoles, serviceKey) => {
                            return (
                                <div key={`${role.name}-${serviceKey}`} className={`${css.service} inline`}>
                                    <Checkbox
                                        locator={`role-container-checkbox-${serviceKey}-${role.name}`}
                                        theme="light"
                                        checked={userRolesByType[role.name] && userRolesByType[role.name].includes(serviceKey) || false}
                                        onClick={(checked: boolean) => this.onRoleClick(
                                            checked,
                                            serviceKey,
                                            role.name
                                        )}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ setRole }, dispatch)
});

export default connect(null, mapDispatchToProps)(Role);