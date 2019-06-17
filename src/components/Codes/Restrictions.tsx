import React from 'react';
import { Formik, FieldArray } from 'formik';
import * as yup from 'yup';
import 'react-dates/initialize';

import Button from 'ui/lib/Button';

import defer, { IDefer } from 'src/utils/Defer';

import {
    ICodeRestrictions,
    TRestriction,
} from 'src/entities/Codes/services/CreateCodes';

import Component from './Restriction';

import css from './Codes.css';

class FormikRestrictions extends Formik<{}, {
    restrictions: ICodeRestrictions;
}> {}

export interface IProps {
    restrictions?: ICodeRestrictions;
}

interface IState {
    validateComponent: boolean;
}

export default class Restrictions extends React.PureComponent<IProps, IState> {
    static defaultProps = {
        restrictions: [{
            type: 'totalPromoCodeActivations',
            totalActivations: 1
        }]
    };

    state = {
        validateComponent: false
    };

    validationDefer: IDefer;
    restrictionsStatus: Array<boolean> = [];
    formRef: React.RefObject<FormikRestrictions> = React.createRef();

    validate() {
        const componentsCount = this.getRestrictions().length;

        if (!componentsCount) {
            return Promise.resolve();
        }

        this.restrictionsStatus = [];
        this.validationDefer = defer();

        this.setState({ validateComponent: true }, () => {
            this.setState({ validateComponent: false });
        });

        return this.validationDefer.promise;
    }

    onRestrictionValidate = (isValid: boolean) => {
        this.restrictionsStatus.push(isValid);

        if (this.getRestrictions().length === this.restrictionsStatus.length) {
            this.restrictionsStatus.includes(false)
                ? this.validationDefer.reject()
                : this.validationDefer.resolve();
        }
    }

    getRestrictions(): ICodeRestrictions {
        return this.formRef.current.getFormikBag().values.restrictions;
    }

    render() {
        const { restrictions } = this.props;
        const { validateComponent } = this.state;

        return (<FormikRestrictions
            ref={this.formRef}
            initialValues={{ restrictions }}
            onSubmit={() => {}}
            render={({ values }) => (<>
                <div className="mb-l">Тип ограничения</div>
                <FieldArray name="restrictions" render={({ push, remove, insert }) => (<>
                    {values.restrictions.map((component: TRestriction, index) => (
                        <Component
                            onValidate={this.onRestrictionValidate}
                            validate={validateComponent}
                            component={component}
                            remove={remove}
                            index={index}
                        />
                    ))}
                    <Button
                        locator="add-restriction-button"
                        onClick={() => {
                            push({ type: null });
                        }}
                        theme="thin-black"
                        mods={['size-small', 'font-size-small']}
                    >
                        Добавить ограничение
                    </Button>
                </>)} />    
            </>)}
        />);
    }
}
