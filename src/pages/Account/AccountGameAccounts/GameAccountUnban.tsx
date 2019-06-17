import React from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Row, Field, Error } from 'src/components/Form/Form';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';

import { IStore } from 'src/store';
import { IGameAccount } from 'src/entities/GameAuth/store';
import { unbanGameAccount, IUnbanGameAccountRequestParams } from 'src/entities/GameAuth/actions';
import { setGameAccountBan, ISetGameAccountBanParams } from 'src/entities/GameAuth/actions';

import { IFormikValues, Reason } from 'src/components/Reason/Reason';

class FormikGameAccountUnban extends Formik<{}, IFormikValues> {}

interface IActions {
    actions?: {
        unbanGameAccount: (params: IUnbanGameAccountRequestParams) => Promise<void>;
        setGameAccountBan: (params: ISetGameAccountBanParams) => void;
    };
}

interface IProps {
    lang?: string;
    userId: string;
    account: IGameAccount;
    loaders?: {
        unbanGameAccount: boolean;
    };
}

import api from 'src/routes/api';

import css from 'src/components/Overlay/Overlay.css';

class GameAccountUnban extends React.PureComponent<IProps & IActions, any> {
    onSubmit = (params: IFormikValues) => {
        const { account, userId, lang } = this.props;

        this.props.actions.unbanGameAccount({
            login: account.login,
            toPartnerId: account.partnerId,
            reason: params.reason
        }).then(() => {
            this.props.actions.setGameAccountBan({
                userId,
                accountId: account.id,
                ban: {
                    until: null,
                    reason: {
                        internal: null,
                        external: {
                            [lang]: null
                        }
                    }
                }
            });
        });
    };

    render() {
        const { account, loaders, lang } = this.props;

        return (
            <FormikGameAccountUnban
                initialValues={{
                    reason: {
                        internal: '',
                        external: {
                            [lang]: ''
                        }
                    }
                }}
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, handleSubmit }) => (<>
                    <Row>
                        <Field>
                            <Input
                                disabled
                                label="Логин"
                                theme="light"
                                value={account.login}
                            />
                        </Field>
                    </Row>
                    <Reason
                        values={values}
                        setFieldValue={setFieldValue}
                    />
                    <div className={css.panel}>
                        <Button
                            isLoading={loaders.unbanGameAccount}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Разбанить
                        </Button>
                        <div className={css.errorContainer}>
                            <Error className={css.error} route={api.gameAuth.unbanGameAccount} />
                            <RequestStatus
                                className="ml-s"
                                route={api.gameAuth.unbanGameAccount}
                                render={() => 'Игровой аккаунт успешно разбанен'}
                            />
                        </div>
                    </div>
                </>)}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    lang: state.area.selected.lang
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        unbanGameAccount,
        setGameAccountBan
    }, dispatch)
});

const GameAccountUnbanWithConnect = connect(mapStateToProps, mapDispatchToProps)(GameAccountUnban);

export default (props: IProps) => (
    <RequestTracker loaders={[ api.gameAuth.unbanGameAccount ]}>
        <GameAccountUnbanWithConnect {...props} />
    </RequestTracker>
);
