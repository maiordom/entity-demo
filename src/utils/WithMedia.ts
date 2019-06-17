import get from 'lodash/get';
import { connect } from 'react-redux';

import { IStore } from 'src/store';

export interface IProps {
    id: string;
    path: string;
    propName?: string;
    defaultValue?: string;
}

const mapStateToProps = ({ imagesGroups }: IStore, ownProps: IProps) => {
    const { id, path, defaultValue = '', propName = 'imgUrl', ...rest } = ownProps;

    return {
        ...rest,
        [propName]: get(imagesGroups, path, defaultValue).replace('{id}', id)
    };
};

export const withMedia = (Component) => connect(mapStateToProps)(Component);

export default withMedia;
