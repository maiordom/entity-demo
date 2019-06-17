import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import Select from 'ui/lib/Select';

import { IStore } from 'src/store';
import { IPagination, IOption } from 'src/entities/Pagination/store';
import { setPagination, ISetPaginationParams } from 'src/entities/Pagination/actions';

export interface IProps {
    className?: string;
    pagination: IPagination;
    onChange?: (value: number, option: IOption) => void;
}

export interface IActions {
    actions: {
        setPagination: (params: ISetPaginationParams) => void;
    };
}

class Pagination extends React.PureComponent<IProps & IActions> {
    onPerPageCountChange = (value: string, option: IOption) => {
        this.props.actions.setPagination({ option });
        this.props.onChange && this.props.onChange(Number(value), option);
    };

    render() {
        const { pagination, className } = this.props;

        return (
            <Select
                onChange={this.onPerPageCountChange}
                position="top"
                theme="light"
                className={classnames(
                    'pagination',
                    className
                )}
                options={pagination.perPageCountOptions.items}
                value={pagination.perPageCountOptions.selected.value}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    pagination: state.pagination
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        setPagination
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
