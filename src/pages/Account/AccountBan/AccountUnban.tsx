import React from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from 'ui/lib/Button';

import { IFormikValues, Reason } from 'src/components/Reason/Reason';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';

import { IStore } from 'src/store';
import { IAccount } from 'src/entities/Accounts/models/Account';
import { unbanAccount, IUnbanAccountRequestParams } from 'src/entities/Auth/actions';
import { updateAccountAction as updateAccount, IGetAccountsRequestParams } from 'src/entities/Accounts/actions';

class FormikUnbanAccount extends Formik<{}, IFormikUnbanAccountValues> {}

interface IFormikUnbanAccountValues extends IFormikValues {}

interface IActions {
    actions?: {
        unbanAccount: (params: IUnbanAccountRequestParams) => Promise<void>;
        updateAccount: (params: IGetAccountsRequestParams) => void;
    };
}

interface IProps {
    lang?: string;
    account: IAccount;
    loaders?: {
        unbanAccount: boolean;
    };
}

import api from 'src/routes/api';

class AccountUnban extends React.PureComponent<IProps & IActions, any> {
    onSubmit = async (params: IFormikUnbanAccountValues) => {
        const { account } = this.props;

        await this.props.actions.unbanAccount({
            userId: account.id,
            reason: params.reason
        });

        this.props.actions.updateAccount({ contact: account.id });
    };

    render() {
        const { account, loaders, lang } = this.props;
        const { ban } = account;

        return (
            <FormikUnbanAccount
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
                    <Reason
                        values={values}
                        setFieldValue={setFieldValue}
                    />
                    <div className="mt-m">
                        <Button
                            isLoading={loaders.unbanAccount}
                            onClick={handleSubmit}
                            className="col-6"
                        >
                            Разбанить
                        </Button>
                        <div className="mt-s">
                            <RequestStatus
                                errorConfig={{
                                    showDetails: true,
                                    className: 'text-align-left'
                                }}
                                routes={[ api.auth.unbanAccount ]}
                                render={() => 'Аккаунт успешно разбанен'}
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
        unbanAccount,
        updateAccount
    }, dispatch)
});

const AccountUnbanWithConnect = connect(mapStateToProps, mapDispatchToProps)(AccountUnban);

export default (props: IProps) => (
    <RequestTracker loaders={[
        api.auth.unbanAccount
    ]}>
        <AccountUnbanWithConnect {...props} />
    </RequestTracker>
);
