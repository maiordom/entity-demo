import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import find from 'lodash/find';

import Select from 'ui/lib/Select';
import Button from 'ui/lib/Button';

import { IOption } from 'src/entities/Apps/store';

import { Inline } from 'src/components/Form/Form';
import { TComponent, TComponentType } from 'src/entities/Codes/models/Component';

import ComponentBetaTesting from './ComponentBetaTesting';
import ComponentProduct from './ComponentProduct';
import ComponentBonus from './ComponentBonus';
import ComponentDiscount from './ComponentDiscount';

const TYPE_PRODUCT = 'product';
const TYPE_BETA_TESTING_ACCEPT = 'betaTestingAccept';
const TYPE_BONUS = 'bonus';
const TYPE_DISCOUNT = 'discount';

const componentsOptions = [
    {
        id: TYPE_PRODUCT,
        value: 'Продукт',
        fields: [ 'productId', 'productQuantity' ],
        autoFill: {
            productQuantity: 1
        }
    },
    { 
        id: TYPE_BETA_TESTING_ACCEPT,
        value: 'Бета тест доступ',
        fields: [ 'betaTestingServiceId', 'betaTestingRequestType' ],
        autoFill: {
            betaTestingRequestType: 'private'
        }
    },
    {
        id: TYPE_BONUS,
        value: 'Бонус',
        fields: [ 'amount', 'currency' ]
    },
    {
        id: TYPE_DISCOUNT,
        value: 'Скидка',
        fields: [ 'discount' ]
    }
];

import css from './Codes.css';

interface IProps {
    validate: boolean;
    component: TComponent;
    remove: (index: number) => void;
    index: number;
    onValidate: (isValid: boolean) => void;
}

class FormikType extends Formik<{}, { type: string; }> {}

export default class Component extends React.PureComponent<IProps, any> {
    formRef: React.RefObject<any> = React.createRef();
    typeRef: React.RefObject<FormikType> = React.createRef();

    componentWillReceiveProps(props: IProps) {
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

    changeType(id: TComponentType) {
        const { component } = this.props;
        const currentComponent = find(componentsOptions, { id });

        Object.keys(component).forEach((key) => {
            if (!currentComponent.fields.includes(key)) {
                delete component[key];
            }
        });

        if (currentComponent.autoFill) {
            Object.assign(component, currentComponent.autoFill);
        }

        component.type = id;
        this.forceUpdate();
    }

    render() {
        const { component, remove, index } = this.props;
        let fields = null;

        switch(component.type) {
            case TYPE_PRODUCT: fields = (
                <ComponentProduct
                    formRef={this.formRef}
                    component={component}
                />
            ); break;
            case TYPE_BETA_TESTING_ACCEPT: fields = (
                <ComponentBetaTesting
                    formRef={this.formRef}
                    component={component}
                />
            ); break;
            case TYPE_BONUS: fields = (
                <ComponentBonus
                    formRef={this.formRef}
                    component={component}
                />
            ); break;
            case TYPE_DISCOUNT: fields = (
                <ComponentDiscount
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
                        initialValues={{
                            type: component.type
                        }}
                        validationSchema={yup.object().shape({
                            type: yup.string().required('Выбери тип компоненты')
                        })}
                        onSubmit={() => {}}
                        render={({ values, setFieldValue, errors }) => (
                            <Select
                                status={errors.type && 'error'}
                                hintClassName={errors.type && 'hint-error'}
                                hint={errors.type && String(errors.type)}
                                mods={['font-size-medium']}
                                locator={`components-${index}`}
                                theme="light"
                                title="Компонента"
                                placeholder="Выбери тип компоненты"
                                options={componentsOptions}
                                value={component.type}
                                onChange={(value, option: IOption) => {
                                    setFieldValue('type', String(option.id));
                                    this.changeType(String(option.id) as TComponentType);
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
                        locator={`remove-component-button-${index}`}
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
