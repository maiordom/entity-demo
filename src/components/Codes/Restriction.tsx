import React from 'react';
import { Formik } from 'formik';
import find from 'lodash/find';
import * as yup from 'yup';
import 'react-dates/initialize';

import Input from 'ui/lib/Input';
import Select from 'ui/lib/Select';
import Button from 'ui/lib/Button';

import { Row, Field, Inline } from 'src/components/Form/Form';
import { IOption } from 'src/entities/Apps/store';

import {
    TRestriction,
    TRestrictionType
} from 'src/entities/Codes/services/CreateCodes';

class FormikType extends Formik<{}, {
    type: TRestrictionType;
}> {}

import RestrictionTotalActivations from './RestrictionTotalActivations';
import RestrictionLifeTime from './RestrictionLifeTime';
import RestrictionGroup from './RestrictionGroup';

const TYPE_TOTAL_PROMO_CODE_ACTIVATIONS = 'totalPromoCodeActivations';
const TYPE_LIFETIME = 'lifetime';
const TYPE_GROUP = 'group';

const restrictionOptions = [
    {
        id: TYPE_TOTAL_PROMO_CODE_ACTIVATIONS,
        value: 'Количество активаций промо-кода',
        fields: [ 'totalActivations' ]
    },
    {
        id: TYPE_LIFETIME,
        value: 'Время активации',
        fields: [ 'lifetimeUntil', 'lifetimeFrom' ]
    },
    {
        id: TYPE_GROUP,
        value: 'Группа пользователей',
        fields: [ 'groupId' ],
        autoFill: {
            contain: true
        }
    }
];

import css from './Codes.css';

export interface IProps {
    validate: boolean;
    component: TRestriction;
    remove: (index: number) => void;
    index: number;
    onValidate: (isValid: boolean) => void;
}

export default class Component extends React.PureComponent<IProps, any> {
    formRef: React.RefObject<any> = React.createRef();
    typeRef: React.RefObject<FormikType> = React.createRef();

    changeType(id: TRestrictionType) {
        const { component } = this.props;
        const restriction = find(restrictionOptions, { id });

        Object.keys(component).forEach((key) => {
            if (!restriction.fields.includes(key)) {
                delete component[key];
            }
        });

        if (restriction.autoFill) {
            Object.assign(component, restriction.autoFill);
        }

        component.type = id;
        this.forceUpdate();
    }

    componentWillReceiveProps(props) {
        if (props.validate) {
            this.validate();
        }
    }

    validate() {
        const form = this.formRef.current;
        const type = this.typeRef.current;

        Promise.all([
            form && form.runValidations(),
            type.runValidations()
        ]).then(([ formValidation = {}, typeValidation = {} ]) => {
            const isValidFormByType = !Object.keys(formValidation).length;
            const isValidType = !Object.keys(typeValidation).length;

            this.props.onValidate(isValidFormByType && isValidType);
        }).catch(() => {
            this.props.onValidate(false);
        });
    }

    render() {
        const { component, remove, index } = this.props;
        let fields = null;

        switch(component.type) {
            case TYPE_TOTAL_PROMO_CODE_ACTIVATIONS: fields = (
                <RestrictionTotalActivations
                    formRef={this.formRef}
                    component={component}
                />
            ); break;

            case TYPE_GROUP: fields = (
                <RestrictionGroup
                    formRef={this.formRef}
                    component={component}
                />
            ); break;

            case TYPE_LIFETIME: fields = (
                <RestrictionLifeTime
                    formRef={this.formRef}
                    component={component}
                />
            ); break;
        }

        return (
            <Inline className="mb-m">
                <div className="col-6">
                    <FormikType
                        ref={this.typeRef}
                        initialValues={{ type: component.type }}
                        validationSchema={yup.object().shape({
                            type: yup.string().required('Выбери тип ограничения')
                        })}    
                        onSubmit={() => {}}
                        render={({ values, setFieldValue, errors }) => (
                            <Select
                                status={errors.type && 'error'}
                                hintClassName={errors.type && 'hint-error'}
                                hint={errors.type && String(errors.type)}
                                mods={['font-size-medium']}
                                theme="light"
                                title="Ограничение"
                                locator={`restrictions-select-${index}`}
                                placeholder="Выбери тип ограничения"
                                options={restrictionOptions}
                                value={component.type}
                                onChange={(value, option: IOption) => {
                                    setFieldValue('type', String(option.id));
                                    this.changeType(String(option.id) as TRestrictionType);
                                }}
                            />
                        )}
                    />
                </div>
                {fields && <div className="col-6 ml-m">
                    {fields}
                </div>}
                <Inline className={`${css.remove} ml-m`}>
                    <Button
                        locator="remove-restriction-button"
                        onClick={() => {
                            remove(index);
                        }}
                        theme="thin-black"
                        mods={['size-small', 'font-size-small']}
                    >
                        Удалить
                    </Button>
                </Inline>
            </Inline>
        );
    }
}
