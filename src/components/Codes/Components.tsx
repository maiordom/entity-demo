import React from 'react';
import { Formik, FieldArray } from 'formik';

import Button from 'ui/lib/Button';
import defer, { IDefer } from 'src/utils/Defer';

import { ICodeComponents } from 'src/entities/Codes/models/Component';
import Component from './Component';

interface IState {
    validateComponent: boolean;
}

interface IFormikComponentsValues {
    components: ICodeComponents;
}

class FormikComponents extends Formik<{}, IFormikComponentsValues> {}

export default class Components extends React.PureComponent<any, IState> {
    state = {
        validateComponent: false
    };

    componentsStatus: Array<boolean> = [];
    formRef: React.RefObject<FormikComponents> = React.createRef();
    componentsRef: React.RefObject<Components>;
    validationDefer: IDefer;

    getComponents(): ICodeComponents {
        return this.formRef.current.getFormikBag().values.components;
    }

    validate() {
        const componentsCount = this.getComponents().length;

        if (!componentsCount) {
            return Promise.resolve();
        }

        this.componentsStatus = [];
        this.validationDefer = defer();

        this.setState({ validateComponent: true }, () => {
            this.setState({ validateComponent: false });
        });

        return this.validationDefer.promise;
    }

    onComponentValidate = (isValid: boolean) => {
        this.componentsStatus.push(isValid);

        if (this.getComponents().length === this.componentsStatus.length) {
            this.componentsStatus.includes(false)
                ? this.validationDefer.reject()
                : this.validationDefer.resolve();
        }
    }

    render() {
        const { validateComponent } = this.state;

        return (<FormikComponents
            ref={this.formRef}
            initialValues={{
                components: [ {} as any ]
            }}
            onSubmit={() => {}}
            render={({ values }) => (<>
                <div className="mb-l">Тип начисляемой сущности</div>
                <FieldArray name="components" render={({ push, remove }) => (<>
                    {values.components.map((component, index) => (
                        <Component
                            onValidate={this.onComponentValidate}
                            validate={validateComponent}
                            component={component}
                            remove={remove}
                            index={index}
                        />
                    ))}
                    <Button
                        onClick={() => {
                            push({ type: null });
                        }}
                        locator="add-component-button"
                        theme="thin-black"
                        mods={['size-small', 'font-size-small']}
                    >
                        Добавить компонент
                    </Button>
                </>)} />
            </>)}
        />);
    }
}
