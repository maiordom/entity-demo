import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { IStore } from 'src/store';
import { removeError, IRemoveErrorParams } from 'src/entities/RequestError/actions';
import { IError } from 'src/entities/RequestError/store';
import { TRoute } from 'src/routes/api';

type IProps = {
    routeName: string;
    error: IError;
} & IOwnProps;

interface IOwnProps {
    locator?: string;
    showDetails?: boolean;
    name?: string;
    route: TRoute;
    detailsFields?: Array<string>;
    className?: string;
}

interface IActions {
    actions: {
        removeError: (params: IRemoveErrorParams) => void;
    }
}

import css from './Form.css';

const errorTemplate = {
    code: 'code',
    description: 'Model is invalid',
    details: {
        data: 'data',
        url: 'https://ru-adminbff.testentity-demo.com/api/eventstore/users/120131700/events?from=0&count=10'
    }
};

class ErrorComponent extends React.PureComponent<IProps & IActions, any> {
    static defaultProps = {
        detailsFields: ['url']
    };

    componentWillUnmount() {
        this.props.actions.removeError({ name: this.props.routeName });
    }

    render() {
        let { locator, className, error, showDetails, detailsFields } = this.props;

        if (!error) {
            return null;
        }

        return (
            <div
                data-locator={locator}
                className={classnames(
                    css.error,
                    className,
                    showDetails && css.hasDetails
                )}
            >
                <div
                    title={error.description}
                    className={css.errorField}
                >
                    description: {error.description}
                </div>
                {showDetails && error.details && (<>
                    {detailsFields.map(key => (
                        <div
                            title={error.details[key]}
                            className={css.errorField}
                        >
                            {key}: {error.details[key]}
                        </div>
                    ))}
                </>)}
            </div>
        );
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => {
    const routeName = ownProps.route && ownProps.route.routeName || ownProps.name;
    const error = state.requestErrors[routeName];

    return {
        routeName,
        error
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ removeError }, dispatch)
});

export const Error = connect(mapStateToProps, mapDispatchToProps)(ErrorComponent);
