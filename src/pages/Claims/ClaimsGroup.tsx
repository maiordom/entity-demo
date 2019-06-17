import React from 'react';
import map from 'lodash/map';
import classNames from 'classnames';
import intersection from 'lodash/intersection';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IClaimsGroup, IUserClaims } from 'src/entities/Claim/store';
import { setClaimsByService, ISetClaimsByServiceParams } from 'src/entities/Claim/actions';
import { setServiceClaim, ISetServiceClaimParams } from 'src/entities/Claim/actions';
import { setGroupClaims, ISetGroupClaimsParams } from 'src/entities/Claim/actions';
import { setClaimServices, ISetClaimServicesParams } from 'src/entities/Claim/actions';

import Checkbox from 'ui/lib/Checkbox';
import Icon from 'ui/lib/Icon';

interface IProps {
    groupKey: string;
    group: IClaimsGroup;
    claimsByType: IUserClaims;
    claimsByService: IUserClaims;
}

interface IActions {
    actions: {
        setClaimsByService: (params: ISetClaimsByServiceParams) => void;
        setServiceClaim: (params: ISetServiceClaimParams) => void;
        setGroupClaims: (params: ISetGroupClaimsParams) => void;
        setClaimServices: (params: ISetClaimServicesParams) => void;
    };
}

interface IState {
    isOpened: boolean;
    groupClaims: Array<string>;
}

import css from './ClaimsGroup.css';

class ClaimsGroup extends React.PureComponent<IProps & IActions, IState> {
    state = {
        isOpened: false,
        groupClaims: this.props.group.claims.map(claim => claim.source)
    };

    onGroupClick = () => {
        this.setState({ isOpened: !this.state.isOpened });
    };

    onClaimsByServiceClick = (checked: boolean, groupName: string, serviceKey: string) => {
        this.props.actions.setClaimsByService({
            checked,
            groupName,
            serviceKey
        });
    };

    onServiceClaimClick = (checked: boolean, groupName: string, serviceKey: string, claim: string) => {
        this.props.actions.setServiceClaim({
            checked,
            groupName,
            serviceKey,
            claim
        });
    };

    onGroupClaimsClick = (checked: boolean, groupName: string) => {
        this.props.actions.setGroupClaims({
            checked,
            groupName
        });
    };

    onClaimServicesClick = (checked: boolean, claimName: string, groupName: string) => {
        this.props.actions.setClaimServices({
            checked,
            claimName,
            groupName
        });
    };

    render() {
        const { group, claimsByType, claimsByService } = this.props;
        const { isOpened, groupClaims } = this.state;
        const servicesCount = Object.keys(claimsByService).length;
        const groupClaimsChecked = groupClaims.every(claim =>
            claimsByType[claim] && claimsByType[claim].length === servicesCount
        );
        const groupClaimsHalfChecked = groupClaims.some(claim =>
            claimsByType[claim] && claimsByType[claim].length > 0
        );

        return (
            <div className={classNames(
                css.container,
                isOpened && css.active,
            )}>
                <div className={`${css.inner} col inline-flex`}>
                    <div className={classNames(
                        css.line,
                        css.titleLine,
                        isOpened && css.active,
                        'inline'
                    )}>
                        <div onClick={this.onGroupClick} className={`${css.title} inline align-items-center`}>
                            <Checkbox
                                locator={`claim-checkbox-${group.name}`}
                                checked={groupClaimsChecked}
                                halfChecked={groupClaimsHalfChecked}
                                className={css.groupCheckbox}
                                theme="light"
                                onClick={(checked: boolean) => this.onGroupClaimsClick(
                                    checked,
                                    group.name
                                )} 
                            />
                            {group.name}
                            <Icon
                                wrapperClassName={classNames(
                                    css.arrow,
                                    isOpened && css.opened,
                                    'ml-xxs'
                                )}
                                name="arrow-up"
                            />
                        </div>
                        {map(claimsByService, (serviceClaims, serviceKey) => {
                            const claimsIntersection = intersection(groupClaims, serviceClaims);

                            return (
                                <div key={`${group.name}-${serviceKey}`} className={`${css.claim} inline`}>
                                    <Checkbox
                                        locator={`claim-checkbox-${group.name}-${serviceKey}`}
                                        checked={claimsIntersection.length === group.claims.length}
                                        halfChecked={claimsIntersection.length > 0 && claimsIntersection.length !== group.claims.length}
                                        theme="light"
                                        onClick={(checked: boolean) => this.onClaimsByServiceClick(
                                            checked,
                                            group.name,
                                            serviceKey
                                        )}
                                    />
                                </div>
                            )
                        })}
                    </div>
                    {isOpened && group.claims.map(claim => (
                        <div key={`${group.name}-group-${claim.source}`} className={`${css.line} inline`}>
                            <div className={css.title}>
                                <Checkbox
                                    locator={`claim-checkbox-${group.name}-group-${claim.source}`}
                                    checked={claimsByType[claim.source] && claimsByType[claim.source].length === servicesCount}
                                    halfChecked={claimsByType[claim.source] && claimsByType[claim.source].length > 0}
                                    className={css.claimCheckbox}
                                    theme="light"
                                    onClick={(checked: boolean) => this.onClaimServicesClick(
                                        checked,
                                        claim.source,
                                        group.name
                                    )}
                                />
                                {claim.alias || claim.source}
                            </div>
                            {map(claimsByService, (service, serviceKey) => (
                                <div
                                    key={`${group.name}-${claim.source}-${serviceKey}`}
                                    className={`${css.claim} inline`}
                                >
                                    <Checkbox
                                        checked={
                                            claimsByType[claim.source] &&
                                            claimsByType[claim.source].includes(serviceKey) || false
                                        }
                                        locator={`${group.name}-${claim.source}-${serviceKey}`}
                                        theme="light"
                                        onClick={(checked: boolean) => this.onServiceClaimClick(
                                            checked,
                                            group.name,
                                            serviceKey,
                                            claim.source
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        setClaimsByService,
        setServiceClaim,
        setGroupClaims,
        setClaimServices
    }, dispatch)
});

export default connect(null, mapDispatchToProps)(ClaimsGroup);
