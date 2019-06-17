import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from 'ui/lib/Button';
import Loader from 'ui/lib/Loader';

import { getCodesByEmissionId, IGetCodesByEmissionIdRequestParams } from 'src/entities/Codes/actions';
import { IEmission } from 'src/entities/Codes/models/Emission';

import RequestTracker, { IRequest } from 'src/components/RequestTracker/RequestTracker';
import api from 'src/routes/api';

export interface IProps {
    loaders?: {
        getCodesByEmissionId: IRequest;
    };
    data: IEmission;
}

export interface IActions {
    actions: {
        getCodesByEmissionId: (params: IGetCodesByEmissionIdRequestParams) => void;
    };
}

class TableControlsComponent extends React.PureComponent<IProps & IActions, any> {
    onClick = () => {
        this.props.actions.getCodesByEmissionId({ emissionId: this.props.data.id });
    };

    render() {
        const { loaders, data } = this.props;

        return (
            <div className={classNames('col', 'align-items-center')}>
                {loaders.getCodesByEmissionId && loaders.getCodesByEmissionId.params.emissionId === data.id
                    ? <Loader size="small" className="inline" />
                    : <Button
                        locator="load-codes-button"
                        onClick={this.onClick}
                        theme="thin-black"
                        mods={['size-small', 'font-size-small']}
                    >
                        Загрузить коды
                    </Button>
                }
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ getCodesByEmissionId }, dispatch)
});

const TableControls = connect(null, mapDispatchToProps)(TableControlsComponent);

export default (props: IProps) => (
    <RequestTracker loaders={[ api.codes.getCodesByEmissionId ]}>
        <TableControls {...props} />
    </RequestTracker>
);
