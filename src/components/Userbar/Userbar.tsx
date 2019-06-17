import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';

import clientRoutes, { getRoute } from 'src/routes/client';
import { logout } from 'src/entities/User/actions';
import { IStore } from 'src/store';
import { IProfile } from 'src/entities/User/store';

interface IProps {
    profile: IProfile;
}

interface IActions {
    actions: {
        logout: () => void;
    };
}

import css from './Userbar.css';

class Userbar extends React.PureComponent<IProps & IActions & RouteComponentProps<any>, {}> {
    onLogoutClick = () => {
        this.props.actions.logout();
        this.props.history.push(clientRoutes.auth);
    };

    onUserOpen = () => {
        this.props.history.push(getRoute('account', { id: this.props.profile.userId }));
    };

    render() {
        const { profile } = this.props;
        const username = profile.username || profile.email;

        return (
            <div className={css.container}>
                <div className={css.user} onClick={this.onUserOpen}>
                    <div className={css.avatar}></div>
                    <div className={css.username}>{username}</div>
                </div>
                <div onClick={this.onLogoutClick} className={classnames('link', css.logout)}>Выйти</div>
            </div>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    profile: state.user.profile
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ logout }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Userbar));
