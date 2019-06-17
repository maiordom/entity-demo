import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IStore } from 'src/store';
import { IAppsOptions, IOption, IApp } from 'src/entities/Apps/store';
import { selectApp } from 'src/entities/Apps/actions';

import Select from 'ui/lib/Select';
import { IPermission } from 'src/entities/User/store';

export { IOption, IAppsOptions, IApp } from 'src/entities/Apps/store';

interface IProps {
    mods?: Array<string>;
    hintClassName?: string;
    disabled?: boolean;
    locator?: string;
    status?: string;
    hint?: string;
    placeholder?: string;
    title?: string;
    value?: string;
    localChanges?: boolean;
    appsOptions: IAppsOptions;
    permission?: IPermission;
    onChange: (option: IOption) => void;
}

interface IActions {
    actions: {
        selectApp: (params: { app: IOption }) => void;
    };
}

interface IState {
    apps: Array<IOption>;
}

class Apps extends React.PureComponent<IProps & IActions, IState> {
    static defaultProps = {
        title: 'Выбери сервис',
        placeholder: 'Доступные сервисы'
    };

    constructor(props: IProps & IActions) {
        super(props);

        this.state = {
            apps: this.filterApps(props.appsOptions, props.permission)
        }
    }

    filterApps(apps: IAppsOptions, permission: IPermission) {
        if (permission) {
            return apps.items.filter(item => permission.includes(String(item.id)));
        }

        return apps.items;
    }

    componentWillReceiveProps(nextProps: IProps & IActions) {
        if (nextProps.appsOptions !== this.props.appsOptions ||
            nextProps.permission !== this.props.permission
        ) {
            this.setState({
                apps: this.filterApps(nextProps.appsOptions, nextProps.permission)
            });
        }
    }

    onChange = (value: string | number, option: IOption) => {
        !this.props.localChanges && this.props.actions.selectApp({ app: option });
        this.props.onChange && this.props.onChange(option);
    }

    render() {
        const { apps } = this.state;
        const {
            mods,
            disabled,
            appsOptions,
            value,
            locator,
            placeholder,
            title,
            status,
            hint,
            hintClassName
        } = this.props;
        const hasValue = 'value' in this.props;

        return (
            <Select
                disabled={disabled}
                status={status}
                hint={hint}
                locator={`${locator}-services-select`}
                mods={mods}
                hintClassName={hintClassName}
                onChange={this.onChange}
                title={title}
                placeholder={placeholder}
                theme="light"
                options={apps}
                value={hasValue
                    ? value
                    : (appsOptions.selected && appsOptions.selected.value)
                }
            />
        );
    }
}

const mapStateToProps = (state: IStore, ownProps: { permission: string; }) => ({
    permission: state.user.permissions[ownProps.permission],
    appsOptions: state.appsOptions
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ selectApp }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Apps);