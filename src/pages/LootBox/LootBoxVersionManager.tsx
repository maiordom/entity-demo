import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import classNames from 'classnames';
import * as yup from 'yup';
import get from 'lodash/get';

import Input from 'ui/lib/Input';
import Checkbox from 'ui/lib/Checkbox';
import Button from 'ui/lib/Button';

import { IStore } from 'src/store';
import { ILootBoxVersion } from 'src/entities/LootBoxes/models/LootBox';
import { IAreaItem } from 'src/entities/Area/store';

import { Form, Row, Field } from 'src/components/Form/Form';

import { changeLootBoxVersion, IChangeLootBoxVersionParams } from 'src/entities/LootBoxes/actions';
import { deleteLootBoxVersion, IDeleteLootBoxVersionParams } from 'src/entities/LootBoxes/actions';
import { createLootBoxVersion, ICreateLootBoxVersionParams } from 'src/entities/LootBoxes/actions';
import { checkLootBoxVisibility, ICheckLootBoxVisibilityParams } from 'src/entities/LootBoxes/actions';

export interface IOwnProps {
    type: string;
    version: ILootBoxVersion;
    lootBoxId: number;
    onSubmit: () => void;
    projectName: string;
}

export interface IProps {
    area: IAreaItem;
}

interface IActions {
    actions: {
        createLootBoxVersion: (params: ICreateLootBoxVersionParams) => void;
        changeLootBoxVersion: (params: IChangeLootBoxVersionParams) => void;
        deleteLootBoxVersion: (params: IDeleteLootBoxVersionParams) => void;
        checkLootBoxVisibility: (params: ICheckLootBoxVisibilityParams) => void;
    };
}

interface IFormikLootBoxVersionManagerValues extends ILootBoxVersion {}

class FormikLootBoxVersionManager extends Formik<{}, IFormikLootBoxVersionManagerValues> {}

import overlayCSS from 'src/components/Overlay/Overlay.css';
import css from './LootBoxVersionManager.css';

class LootBoxVersionManager extends PureComponent<IOwnProps & IProps & IActions> {
    static defaultProps = {
        version: {
            name: {
                ru: '',
                en: '',
                pt: ''
            },
            price: '',
            quantity: '',
            isEnabled: true
        }
    };

    onVersionDelete = () => {
        this.props.actions.deleteLootBoxVersion({
            version: this.props.version,
            lootBoxId: this.props.lootBoxId,
            projectName: this.props.projectName
        });
        this.props.actions.checkLootBoxVisibility({
            lootBoxId: this.props.lootBoxId,
            projectName: this.props.projectName
        });
        this.props.onSubmit();
    };

    onVersionCreate = (values: IFormikLootBoxVersionManagerValues) => {
        this.props.actions.createLootBoxVersion({
            version: values,
            lootBoxId: this.props.lootBoxId,
            projectName: this.props.projectName
        });
        this.props.actions.checkLootBoxVisibility({
            lootBoxId: this.props.lootBoxId,
            projectName: this.props.projectName
        });
        this.props.onSubmit();
    };

    onVersionChange = (values: IFormikLootBoxVersionManagerValues) => {
        this.props.actions.changeLootBoxVersion({
            newVersion: values,
            version: this.props.version,
            lootBoxId: this.props.lootBoxId,
            projectName: this.props.projectName
        });
        this.props.actions.checkLootBoxVisibility({
            lootBoxId: this.props.lootBoxId,
            projectName: this.props.projectName
        });
        this.props.onSubmit();
    };

    render() {
        const { version, type, area: { lang } } = this.props;
        const actionTitle = type === 'create'
            ? 'Создать'
            : 'Сохранить';

        return (
            <FormikLootBoxVersionManager
                initialValues={{ ...version }}
                validationSchema={yup.object().shape({
                    name: yup.object().shape({
                        [lang]: yup.string().required('Укажи название')
                    }),
                    price: yup.number()
                        .min(1, 'Нормально делай')
                        .required('Укажи цену'),
                    quantity: yup.number()
                        .min(1, 'Количество прокруток должно быть хотя бы 1')
                        .required('Укажи количество')
                })}
                onSubmit={type === 'create'
                    ? this.onVersionCreate
                    : this.onVersionChange
                }
                render={({ values, errors, touched, setFieldValue, handleSubmit }) => (
                    <Form className={classNames(
                        overlayCSS.container,
                        'col-8',
                        'pl-m',
                        'pt-m',
                        'pr-m'
                    )}>
                        <div className="font-size-large mb-m">Версия</div>
                        <Row className="mt-s">
                            <Field>
                                <Input
                                    status={
                                        get(touched, `name.${lang}`) && 
                                        get(errors, `name.${lang}`) ? 'error' : null
                                    }
                                    hint={
                                        get(touched, `name.${lang}`) &&
                                        get(errors, `name.${lang}`) as string
                                    }
                                    theme="light"
                                    label="Название"
                                    placeholder="Укажи название"
                                    value={values.name[lang]}
                                    onChange={(name: string) => {
                                        setFieldValue(`name.${lang}`, name);
                                    }}
                                />
                            </Field>
                        </Row>
                        <Row className="mt-s">
                            <Field>
                                <Input
                                    status={touched.price && errors.price ? 'error' : null}
                                    hint={touched.price && errors.price as string}
                                    theme="light"
                                    label="Стоимость"
                                    placeholder="Укажи стоимость"
                                    value={String(values.price)}
                                    onChange={(price: string) => {
                                        setFieldValue('price', price);
                                    }}
                                />
                            </Field>
                        </Row>
                        <Row>
                            <Field>
                                <Input
                                    status={touched.quantity && errors.quantity ? 'error' : null}
                                    hint={touched.quantity && errors.quantity as string}
                                    theme="light"
                                    label="Количество"
                                    placeholder="Укажи Количество"
                                    value={String(values.quantity)}
                                    onChange={(quantity: string) => {
                                        setFieldValue('quantity', quantity);
                                    }}
                                />
                            </Field>
                        </Row>
                        <Row>
                            <Checkbox
                                theme="light"
                                label="Можно играть"
                                checked={values.isEnabled}
                                onClick={(isEnabled: boolean) => {
                                    setFieldValue('isEnabled', isEnabled);
                                }}
                            />
                        </Row>
                        <Row>
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                className="pl-s pr-s"
                            >
                                {actionTitle}
                            </Button>
                            {type === 'edit' && (
                                <div
                                    onClick={this.onVersionDelete}
                                    className={`
                                        ml-xxs
                                        ${css.deleteButton}
                                    `}
                                >
                                    Удалить версию
                                </div>
                            )}
                        </Row>
                    </Form>
                )}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    area: state.area.selected
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        changeLootBoxVersion,
        deleteLootBoxVersion,
        createLootBoxVersion,
        checkLootBoxVisibility
    }, dispatch)
});

const LootBoxVersionManagerWithConnect = connect(mapStateToProps, mapDispatchToProps)(LootBoxVersionManager);

export default (props: IOwnProps) => (
    <LootBoxVersionManagerWithConnect {...props} />
);
