import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import map from 'lodash/map';

import Select from 'ui/lib/Select';

import { IOption } from 'src/entities/Apps/store';
import { IStore } from 'src/store';
import { IRoles } from 'src/entities/Roles/store';

import { setService, ISetServiceParams } from 'src/entities/Roles/actions';

import Role from './Role';

interface IProps {
    roles: IRoles;
}

interface IActions {
    actions: {
        setService: (params: ISetServiceParams) => void;
    };
}

import css from './RolesList.css';

class RolesList extends React.PureComponent<IProps & IActions, {}> {
    onServiceChange = (value: string, option: IOption) => {
        this.props.actions.setService({ option });
    };

    render() {
        const { rolesList, userRolesByService, userRolesByType, apps } = this.props.roles;

        return (
            <div>
                <div className={`${css.head} align-items-center inline mb-m`}>
                    <div data-locator="roles-list-title" className={css.title}>Выдача прав</div>
                    {map(userRolesByService, (service, key) => (
                        <div key={key} className={css.role}>
                            <div className={css.roleName}>{key}</div>
                        </div>
                    ))}
                    <Select
                        locator="roles-list-select-add-service"
                        className="col-4 ml-m flex-shrink-fixed"
                        placeholder="Добавить сервис"
                        options={apps.items}
                        theme="light"
                        onChange={this.onServiceChange}
                        value={apps.selected && apps.selected.value}
                    />
                    <div className="col-1 flex-shrink-fixed">&nbsp;</div>
                </div>
                {map(rolesList, (role, key) => (
                    <Role
                        key={key}
                        role={role}
                        userRolesByService={userRolesByService}
                        userRolesByType={userRolesByType}
                    />
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    roles: state.roles
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        setService
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RolesList);
