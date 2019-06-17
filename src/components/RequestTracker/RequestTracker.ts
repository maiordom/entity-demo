import { connect } from 'react-redux';
import React, { ReactElement } from 'react';
import isEqual from 'lodash/isEqual';

import { IStore } from 'src/store';
import { IRequestJournal } from 'src/entities/RequestJournal/store';
import { IRequest } from 'src/entities/RequestJournal/store';
export { IRequest } from 'src/entities/RequestJournal/store';

export interface ILoader {
    routeName: string;
    alias?: string;
}

export type ILoaders = Array<ILoader>;

export interface IOwnProps {
    loaders?: ILoaders;
    children?: ReactElement<any>;
}

export interface IProps {
    requestJournal: IRequestJournal;
}

export type TProps = IOwnProps & IProps;

interface IState {
    loaders?: {
        [key: string]: IRequest;
    }
}

class RequestTracker extends React.PureComponent<TProps, IState> {
    static defaultProps = {
        loaders: []
    };

    constructor(props: TProps) {
        super(props);

        this.state = { loaders: this.getLoaders(props) };
    }

    getLoaders(props: TProps) {
        const { loaders: externalLoadersConfig, requestJournal } = props;
        const nextLoaders = {};
    
        externalLoadersConfig.forEach((loader) => {
            nextLoaders[loader.alias || loader.routeName] = requestJournal[loader.routeName] || false;
        });

        return nextLoaders;
    }

    componentWillReceiveProps(nextProps: TProps) {
        const loaders = this.getLoaders(nextProps);

        if (!isEqual(loaders, this.state.loaders)) {
            this.setState({ loaders });
        }
    }

    render() {
        const { children } = this.props;
        const { loaders } = this.state;

        return(
            React.cloneElement(children, { loaders })
        );
    }
}

const mapStateToProps = (state: IStore): TProps => ({
    requestJournal: state.requestJournal
});

export default connect(mapStateToProps, null)(RequestTracker);
