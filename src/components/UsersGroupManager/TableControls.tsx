import React from 'react';
import { connect } from 'react-redux';

import Button from 'ui/lib/Button';
import Loader from 'ui/lib/Loader';

import { IUsersGroup } from 'src/entities/UsersGroups/store';
import deleteUsersGroup, { IDeleteUsersGroupRequestParams } from 'src/entities/UsersGroups/services/DeleteUsersGroup';
import RequestTracker, { IRequest } from 'src/components/RequestTracker/RequestTracker';
import api from 'src/routes/api';

export interface IProps {
    loaders?: {
        deleteUsersGroup: IRequest;
    };
    data: IUsersGroup;
    onUsersGroupClick: (data: IUsersGroup) => void;
    onUsersGroupDeleted: (data: IUsersGroup) => void;
}

export interface IActions {
    actions: {
        deleteUsersGroup: (params: IDeleteUsersGroupRequestParams) => void;
    };
}

class TableControlsComponent extends React.PureComponent<IProps & IActions, any> {
    onUsersGroupClick = () => {
        this.props.onUsersGroupClick(this.props.data);
    };

    onUsersGroupDelete = async () => {
        await this.props.actions.deleteUsersGroup({ id: this.props.data.id });
        this.props.onUsersGroupDeleted(this.props.data);
    };

    render() {
        const { loaders, data } = this.props;

        return (
            <div className="inline">
                <Button
                    onClick={this.onUsersGroupClick}
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                >
                    Редактировать
                </Button>
                <div className="col-3 ml-s align-items-center">
                    {loaders.deleteUsersGroup && loaders.deleteUsersGroup.params.id === data.id
                        ? <Loader size="small" className="inline" />
                        : <Button
                            onClick={this.onUsersGroupDelete}
                            theme="thin-black"
                            mods={['size-small', 'font-size-small']}
                        >
                            Удалить
                        </Button>
                    }
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = () => ({
    actions: {
        deleteUsersGroup
    }
});

const TableControls = connect(null, mapDispatchToProps)(TableControlsComponent);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.groupManager.deleteUsersGroup
    ]}>
        <TableControls {...props} />
    </RequestTracker>
);
