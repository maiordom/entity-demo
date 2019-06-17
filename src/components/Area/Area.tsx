import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Select from 'ui/lib/Select';

import { IArea, IAreaItem } from 'src/entities/Area/store';
import { IStore } from 'src/store';

import { setAreaAction as setArea, ISetAreaParams } from 'src/entities/Area/actions';

interface IProps {
    area: IArea;
}

interface IActions {
    actions: {
        setArea: (params: ISetAreaParams) => void;
    };
}

class Area extends React.PureComponent<IProps & IActions, any> {
    onChange = (value: string, option: IAreaItem) => {
        this.props.actions.setArea({ area: option });
    };

    render() {
        const { items, selected } = this.props.area;

        return (
            <Select
                onChange={this.onChange}
                mods={['gray-list']}
                position="top"
                theme="light"
                value={selected.value}
                options={items}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    area: state.area
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ setArea }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Area);