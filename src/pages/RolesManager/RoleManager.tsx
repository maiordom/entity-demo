import React from 'react';
import map from 'lodash/map';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';

import Button from 'ui/lib/Button';
import Input from 'ui/lib/Input';

import { Form, Row, Field, Error } from 'src/components/Form/Form';

import { IStore } from 'src/store';
import { IClaims } from 'src/entities/Claim/store';
import { IRole } from 'src/entities/Roles/store';

import ClaimsGroup from './ClaimsGroup';

import css from 'src/components/Overlay/Overlay.css';

import api from 'src/routes/api';

interface IProps {
    claims: IClaims;
}

interface IOwnProps {
    role?: IRole;
    routeName: string;
    isLoading: boolean;
    onSubmit: (values: IFormikRoleManagerValues, role: IRole) => void;
    title: string;
    actionTitle: string;
    locator?: string;
}

export interface IFormikRoleManagerValues {
    roleName: string;
}

class FormikRoleManager extends Formik<{}, IFormikRoleManagerValues> {}

class RoleManager extends React.PureComponent<IProps & IOwnProps, any> {
    static defaultProps = {
        role: {
            name: '',
            claims: []
        }
    };

    onSubmit = (params: IFormikRoleManagerValues) => {
        this.props.onSubmit(params, this.props.role);
    };

    render() {
        const {
            title,
            actionTitle,
            onSubmit,
            role,
            isLoading,
            routeName,
            locator
        } = this.props;
        const { groups } = this.props.claims;

        return (
            <FormikRoleManager
                initialValues={{ roleName: role.name }}
                onSubmit={this.onSubmit}
                validationSchema={yup.object().shape({
                    roleName: yup.string().required('Необходимо указать название роли')
                })}
                render={({ setFieldValue, errors, handleSubmit, values }) => (
                    <Form className={`${css.container} pl-l pt-xl`}>
                        <div className="font-size-large mb-m">{title}</div>
                        <div className="col-6">
                            <Row>
                                <Field>
                                    <Input
                                        locator={`role-manager-${locator}-role-name-${values.roleName}`}
                                        status={errors.roleName ? 'error' : null}
                                        hint={errors.roleName && String(errors.roleName)}                                    
                                        label="Название роли"
                                        placeholder="Укажи название роли"
                                        value={values.roleName}
                                        theme="light"
                                        onChange={(value: string) => {
                                            setFieldValue('roleName', value);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row col>
                                {map(groups, (group, key) => (
                                    <ClaimsGroup
                                        key={key}
                                        group={group}
                                    />
                                ))}
                            </Row>
                        </div>
                        <div className={css.panel}>
                            <Button
                                locator={`role-manager-${locator}-button-${values.roleName}`}
                                isLoading={isLoading}
                                onClick={handleSubmit}
                                className="col-6"
                            >
                                {actionTitle}
                            </Button>
                            <div className={css.errorContainer}>
                                <Error className={css.error} route={api.roles[routeName]} />
                            </div>
                        </div>
                    </Form>
                )}
            />
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    claims: state.claims
});

export default connect(mapStateToProps, null)(RoleManager);
