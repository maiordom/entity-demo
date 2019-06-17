import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { connect } from 'react-redux';

import Input from 'ui/lib/Input';
import { Row, Field } from 'src/components/Form/Form';
import { IComponentBonus } from 'src/entities/Codes/models/Component';

import { IArea } from 'src/entities/Area/store';
import { IStore } from 'src/store';

interface IProps {
    area: IArea;
    formRef: React.RefObject<FormikComponentBonus>;
    component: IComponentBonus;
}

const currentLocalization = {
    rub: 'в рублях',
    eur: 'в евро',
    brl: 'в реалах'
};

export class FormikComponentBonus extends Formik<{}, IComponentBonus> {}

class ComponentBonus extends React.Component<IProps, any> {
    componentDidMount() {
        this.props.component.currency = this.props.area.selected.currency;
    }

    render() {
        const {
            area,
            formRef,
            component
        } = this.props;

        return (
            <FormikComponentBonus
                ref={formRef}
                validationSchema={yup.object().shape({
                    amount: yup.number().integer().positive()
                        .required('Необходимо указать количество бонусов')
                        .typeError('Необходимо ввести число')
                })}
                initialValues={{ ...component }}
                onSubmit={() => {}}
                render={({ values, setFieldValue, errors }) => (
                    <Row>
                        <Field>
                            <Input
                                status={errors.amount ? 'error' : null}
                                hint={errors.amount && String(errors.amount)}
                                theme="light"
                                locator="bonuses-input"
                                placeholder={`Укажи количество бонусов ${currentLocalization[area.selected.currency]}`}
                                label={`Количество бонусов ${currentLocalization[area.selected.currency]}`}
                                value={values.amount && String(values.amount)}
                                onChange={(value: string) => {
                                    setFieldValue('amount', value);
                                    component.amount = Number(value);
                                }}
                            />
                        </Field>
                    </Row>
                )}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    area: state.area
});

export default connect(mapStateToProps)(ComponentBonus);
