import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IStore } from 'src/store';
import { IClaims } from 'src/entities/Claim/store';
import { IProfile, IPermissions } from 'src/entities/User/store';

import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { Form, Row, Error } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import ClaimsGroups from './ClaimsGroups';
import Panel from 'src/components/Panel/Panel';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';

import { setServices } from 'src/entities/Claim/actions';
import { getClaims, IGetClaimsRequestParams, IGetClaimsResult } from 'src/entities/Claim/actions';
import { applyUserClaims } from 'src/entities/Claim/actions';
import { setClaims, ISetClaimsParams } from 'src/entities/Claim/actions';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

interface IProps {
    claims: IClaims;
    profile: IProfile;
    permissions: IPermissions;
    loaders?: {
        getClaims: boolean;
        addClaim: boolean;
        deleteClaim: boolean;
    };
}

interface IActions {
    actions: {
        getClaims: (params: IGetClaimsRequestParams) => Promise<IGetClaimsResult>;
        applyUserClaims: () => Promise<void>;
        setServices: () => void;
        setClaims: (params: ISetClaimsParams) => void;
    };
}

import api from 'src/routes/api';

import overlayCSS from 'src/components/Overlay/Overlay.css';

class ClaimsComponent extends React.PureComponent<IProps & IActions, {}> {
    searchUserByIdInputRef: React.RefObject<Input<any>> = React.createRef();

    async componentDidMount() {
        const { userId } = this.props.profile;

        const claims = await this.props.actions.getClaims({ userId: this.props.profile.userId })
        this.props.actions.setClaims({ userId, claims });
        this.props.actions.setServices();
    }

    onSearchUserByIdClick = async (event: React.KeyboardEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const userId = this.searchUserByIdInputRef.current.getValue();

        const claims = await this.props.actions.getClaims({ userId });
        this.props.actions.setClaims({ userId, claims });
        this.props.actions.setServices();
    };

    onSetClaimsClick = async () => {
        const { userId } = this.props.claims;

        await this.props.actions.applyUserClaims();
        const claims = await this.props.actions.getClaims({ userId })
        this.props.actions.setClaims({ userId, claims });
        this.props.actions.setServices();
    }

    render() {
        const { loaders, claims, permissions } = this.props;
        const hasClaims = claims.claimsList;

        return (
            <Container>
                <Title>Доступы</Title>
                <Inner className="mt-xl pb-xxl">
                    <div className="ml-xl">
                        <Form>
                            <Row className="align-items-flex-end">
                                <Input
                                    locator="user-input"
                                    ref={this.searchUserByIdInputRef}
                                    label="Поиск пользователя по userId, например 120238808"
                                    placeholder="Укажи userId"
                                    theme="light"
                                />
                                <Button
                                    locator="search-button"
                                    isLoading={loaders.getClaims}
                                    onClick={this.onSearchUserByIdClick}
                                    className="ml-m col-3"
                                    mods={['size-medium', 'font-size-medium']}
                                    type="submit"
                                >
                                    Найти
                                </Button>
                            </Row>
                            <Error className="text-align-left mt-m" route={api.claim.getClaims} />                       
                        </Form>
                        {hasClaims && (
                            <div className="mt-l">
                                <ClaimsGroups />
                            </div>
                        )}
                    </div>
                </Inner>
                {'auth.read.claims' in permissions &&
                'auth.write.claims' in permissions && (
                    <Panel>
                        <Button
                            locator="add-claims-button"
                            isLoading={loaders.addClaim || loaders.deleteClaim}
                            className="col-7"
                            onClick={this.onSetClaimsClick}
                        >
                            Выдать права
                        </Button>
                        <RequestStatus
                            errorConfig={{
                                showDetails: true,
                                className: overlayCSS.error
                            }}
                            className="ml-s"
                            render={() => 'Права выданы'}
                            routes={[
                                api.claim.addClaim,
                                api.claim.deleteClaim
                            ]}
                        />
                    </Panel>
                )}
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    claims: state.claims,
    profile: state.user.profile,
    permissions: state.user.permissions
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getClaims,
        applyUserClaims,
        setServices,
        setClaims
    }, dispatch)
});

const Claims = connect(mapStateToProps, mapDispatchToProps)(ClaimsComponent);

export default (props: IProps & IActions) => (
    <RequestTracker loaders={[
        api.claim.getClaims,
        api.claim.addClaim,
        api.claim.deleteClaim
    ]}>
        <Claims {...props} />
    </RequestTracker>
);
