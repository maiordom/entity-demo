import React from 'react';
import map from 'lodash/map';
import classNames from 'classnames';
import intersection from 'lodash/intersection';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IClaimsGroup } from 'src/entities/Claim/store';
import { setClaimsByService, ISetClaimsByServiceParams } from 'src/entities/Claim/actions';
import { setServiceClaim, ISetServiceClaimParams } from 'src/entities/Claim/actions';

import { IClaims } from 'src/entities/Claim/store';
import { IStore } from 'src/store';
import { IRoles } from 'src/entities/Roles/store';

import Checkbox from 'ui/lib/Checkbox';
import Icon from 'ui/lib/Icon';

interface IProps {
    claims: IClaims;
    roles: IRoles;
}

interface IOwnProps {
    group: IClaimsGroup;
}

interface IActions {
    actions: {
        setClaimsByService: (params: ISetClaimsByServiceParams) => void;
        setServiceClaim: (params: ISetServiceClaimParams) => void;
    };
}

interface IState {
    isOpened: boolean;
    claimsGroup: Array<string>;
}

import css from './ClaimsGroup.css';

class ClaimsGroup extends React.PureComponent<IProps & IOwnProps & IActions, IState> {
    state = {
        isOpened: false,
        claimsGroup: this.props.group.claims.map(claim => claim.source)
    };

    containerRef: React.RefObject<HTMLDivElement> = React.createRef();

    attachEvents() {
        window.addEventListener('click', this.onWindowClick, false);
    }

    detachEvents() {
        window.removeEventListener('click', this.onWindowClick, false);
    }

    onWindowClick = (event) => {
        if (this.containerRef && !this.containerRef.current.contains(event.target)) {
            this.setState({ isOpened: false });
            this.detachEvents();
        }
    };

    componentDidMount() {
        this.attachEvents();
    }

    componentWillUnmount() {
        this.detachEvents();
    }

    onGroupClick = () => {
        this.setState({ isOpened: !this.state.isOpened });

        !this.state.isOpened
            ? this.attachEvents()
            : this.detachEvents();
    };

    onClaimsByGroupClick = (checked: boolean, groupName: string) => {
        this.props.actions.setClaimsByService({
            checked,
            groupName,
            serviceKey: this.props.roles.roleService
        });
    };

    onClaimClick = (checked: boolean, groupName: string, claim: string) => {
        this.props.actions.setServiceClaim({
            checked,
            claim,
            groupName,
            serviceKey: this.props.roles.roleService
        });
    };

    render() {
        const { claimsByService, claimsByType } = this.props.claims;
        const { group } = this.props;
        const { isOpened, claimsGroup } = this.state;
        const { roleService } = this.props.roles;
        const claimsIntersection = intersection(claimsGroup, claimsByService[roleService]);

        return (
            <div
                ref={this.containerRef}
                className={classNames(
                    css.container,
                    isOpened && css.active,
                )}
            >
                <div className={`${css.inner} col inline-flex`}>
                    <div className={classNames(
                        css.line,
                        css.titleLine,
                        isOpened && css.active,
                        'inline'
                    )}>
                        <div onClick={this.onGroupClick} className={`${css.title} inline align-items-center`}>
                            <Checkbox
                                label={group.name}
                                checked={claimsIntersection.length === group.claims.length}
                                halfChecked={claimsIntersection.length > 0 && claimsIntersection.length !== group.claims.length}
                                theme="light"
                                onClick={(checked: boolean) => this.onClaimsByGroupClick(
                                    checked,
                                    group.name
                                )}
                            />
                            <Icon
                                wrapperClassName={classNames(
                                    css.arrow,
                                    isOpened && css.opened,
                                    'ml-xxs'
                                )}
                                name="arrow-up"
                            />
                        </div>
                    </div>
                    {isOpened && group.claims.map(claim => (
                        <div className={`${css.line} inline`}>
                            <div className={css.title}>
                                <Checkbox
                                    label={claim.alias || claim.source}
                                    theme="light"
                                    checked={claimsByType[claim.source] && claimsByType[claim.source].includes(roleService) || false}
                                    onClick={(checked: boolean) => this.onClaimClick(
                                        checked,
                                        group.name,
                                        claim.source
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps): IProps & IOwnProps => ({
    claims: state.claims,
    roles: state.roles,
    ...ownProps
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        setClaimsByService,
        setServiceClaim
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClaimsGroup);
