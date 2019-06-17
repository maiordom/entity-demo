import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IRoutes, IRoute } from 'src/entities/Navigation/store';
import { IStore } from 'src/store';

import { toggleRoute, IToggleRouteParams } from 'src/entities/Navigation/actions';

interface IProps {
    route: IRoute;
}

interface IActions {
    actions?: {
        toggleRoute: (params: IToggleRouteParams) => void;
    };
}

import css from './Router.css';

class Router extends React.Component<IProps & IActions, any> {
    onLinkClick = () => {
        const { route  } = this.props;

        this.props.actions.toggleRoute({ route });
    };

    render() {
        const { route, actions } = this.props;
        const { isActive } = route;

        return (<>
            <NavLink
                data-locator={`navlink-${route.alias}`}
                exact
                onClick={this.onLinkClick}
                className={css.link}
                to={route.link}
                activeClassName={isActive ? css.linkActive : css.link}
            >
                {route.name}
            </NavLink>
            {route.routes && isActive && (
                <div className={css.list}>
                    {route.routes.map((route: IRoute) => (
                        <Router
                            key={route.link}
                            route={route}
                            actions={actions}
                        />
                    ))}
                </div>
            )}
        </>);
    };
}

class Navigation extends React.Component<{
    navigation: IRoutes;
} & IActions> {
    render() {
        const { navigation, actions } = this.props;

        return (
            <div className={css.container}>
                {navigation[0].routes.map((route: IRoute) =>
                    <Router
                        actions={actions}
                        key={route.link}
                        route={route}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    navigation: state.navigation
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ toggleRoute }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
