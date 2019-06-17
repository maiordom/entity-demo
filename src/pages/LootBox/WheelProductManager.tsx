import React, { PureComponent } from 'react';
import { Formik } from 'formik';
import classNames from 'classnames';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { bindActionCreators } from 'redux';
import cloneDeep from 'lodash/cloneDeep';
import * as yup from 'yup';
import get from 'lodash/get';

import Checkbox from 'ui/lib/Checkbox';
import Button from 'ui/lib/Button';
import Radio from 'ui/lib/Radio';
import Input from 'ui/lib/Input';
import Suggest from 'ui/lib/Suggest';
import Spinner from 'ui/lib/Spinner';
import RadioGroup, { IData as IRadioGroupItem } from 'ui/lib/RadioGroup';

import { IOption } from 'src/entities/Apps/store';
import { ILootBoxComponent } from 'src/entities/LootBoxes/models/LootBox';
import { IAreaItem } from 'src/entities/Area/store';
import { IStore } from 'src/store';
import { IImagesGroups } from 'src/entities/ImagesGroups/store';
import { IShopItem } from 'src/entities/ShopItems/models/ShopItem';

import { Form, Row, Field, SimpleError } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import WheelPrize from './WheelPrize';

import getShopItems, { IGetShopItemsRequestParams, IGetShopItemsResult } from 'src/entities/ShopItems/services/GetShopItems';
import { createLootBoxComponent, ICreateLootBoxComponentParams } from 'src/entities/LootBoxes/actions';
import { changeLootBoxComponent, IChangeLootBoxComponentParams } from 'src/entities/LootBoxes/actions';
import { deleteLootBoxComponent, IDeleteLootBoxComponentParams } from 'src/entities/LootBoxes/actions';

interface IFormikWheelProductManagerValues extends ILootBoxComponent {}

class FormikWheelProductManager extends Formik<{}, IFormikWheelProductManagerValues> {}

interface IOwnProps {
    product: ILootBoxComponent;
    lootBoxId: number;
    onSubmit: () => void;
    type: string;
    projectName: string;
}

interface IProps {
    area: IAreaItem;
    imagesGroups: IImagesGroups;
    loaders: {
        getShopItems: boolean;
    };
}

interface IState {
    options: Array<ISuggestOption>;
    suggestValue: ISuggestOption;
    transferRules: Array<IRadioGroupItem>;
    customTransferRuleActive: boolean;
    customTransferRuleText: string;
    product: ILootBoxComponent;
}

interface IActions {
    actions: {
        getShopItems: (params: IGetShopItemsRequestParams) => Promise<IGetShopItemsResult>;
        createLootBoxComponent: (params: ICreateLootBoxComponentParams) => void;
        changeLootBoxComponent: (params: IChangeLootBoxComponentParams) => void;
        deleteLootBoxComponent: (params: IDeleteLootBoxComponentParams) => void;
    };
}

interface ISuggestOption extends IOption {
    item: IShopItem;
}

import overlayCSS from 'src/components/Overlay/Overlay.css';
import css from './WheelProductManager.css';

import api from 'src/routes/api';

const transferRules = [
    {
        text: 'Нельзя обменять или продать на аукционе',
        value: 1
    },
    {
        text: 'Нельзя обменять, но можно продать на аукционе',
        value: 2
    },
    {
        text: 'Приз можно продать на аукционе, а его содержимое нет',
        value: 3
    },
    {
        text: 'Содержимое нельзя обменять, но можно продать на аукционе',
        value: 4
    }
];

type TProps = IProps & IActions & IOwnProps;

class WheelProductManager extends PureComponent<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const { product, area } = props;
        const state: IState = {
            suggestValue: {
                value: '',
                id: null,
                item: null
            },
            product: product || this.getProductTemplate(),
            options: [],
            transferRules: cloneDeep(transferRules),
            customTransferRuleActive: false,
            customTransferRuleText: ''
        };

        let hasRuleMatch = false;
        const isTransportable = state.product.description[area.lang].isTransportable;

        state.transferRules = state.transferRules.map(rule => {
            const isSelected = rule.text === isTransportable;
            rule.selected = isSelected;

            if (isSelected) {
                hasRuleMatch = true;
            }

            return rule;
        });

        if (!hasRuleMatch && isTransportable) {
            state.customTransferRuleActive = true;
            state.customTransferRuleText = isTransportable;
        } 

        this.state = state;
    }

    getProductTemplate(): ILootBoxComponent {
        const { area: { lang } } = this.props;

        return {
            id: null,
            probability: null,
            quantity: null,
            isMainPrize: false,
            name: {
                name: {
                    [lang]: ''
                }
            },
            description: {
                [lang]: {
                    isRealMainPrize: true,
                    isTransportable: '',
                    textDescription: {
                        type: 'text',
                        text: ''
                    }
                }
            }
        }
    }

    formRef: React.RefObject<FormikWheelProductManager> = React.createRef();

    onProductCreate = (values: IFormikWheelProductManagerValues) => {
        this.props.actions.createLootBoxComponent({
            lootBoxId: this.props.lootBoxId,
            component: values,
            projectName: this.props.projectName
        });
        this.props.onSubmit();
    };

    onProductChange = (values: IFormikWheelProductManagerValues) => {
        this.props.actions.changeLootBoxComponent({
            lootBoxId: this.props.lootBoxId,
            newComponent: values,
            component: this.props.product,
            projectName: this.props.projectName
        });
        this.props.onSubmit();
    };

    onProductDelete = () => {
        this.props.actions.deleteLootBoxComponent({
            lootBoxId: this.props.lootBoxId,
            component: this.props.product,
            projectName: this.props.projectName
        });
        this.props.onSubmit();
    };

    renderOption = (option: ISuggestOption) => <>
        {option.value}
    </>;

    onShopItemsGet = async (name: string) => {
        const { area } = this.props;
        const { items } = await this.props.actions.getShopItems({
            name,
            serviceId: 'aion-ru',
            count: 100
        });

        let shopItems = [];

        items.forEach(item => {
            shopItems = shopItems.concat({
                id: item.id,
                value: item.name[area.lang],
                item
            });

            if (item.versions && item.versions.length) {
                const versions = item.versions.map(version => ({
                    id: version.id,
                    value: version.name[area.lang],
                    item: version
                }));

                shopItems = shopItems.concat(versions);
            }
        });

        this.setState({
            options: shopItems
        });
    };

    onTransferRulesChange = (value: number, callback: () => void) => {
        this.setState({
            transferRules: this.state.transferRules.map(rule => {
                rule.selected = rule.value === value;
                return rule;
            }),
            customTransferRuleActive: false
        }, callback);
    };

    onCustomTransferRuleChange = (callback: () => void) => {
        this.setState({
            transferRules: this.state.transferRules.map(rule => {
                rule.selected = false;
                return rule;
            }),
            customTransferRuleActive: true
        }, callback);
    };

    render() {
        const { suggestValue, options, customTransferRuleActive } = this.state;
        const { type, loaders, area, imagesGroups } = this.props;
        const { product } = this.state;
        const actionTitle = type === 'create'
            ? 'Создать'
            : 'Сохранить';

        return (
            <FormikWheelProductManager
                ref={this.formRef}
                validationSchema={yup.object().shape({
                    id: yup.string()
                        .typeError('Укажи товар')
                        .required('Укажи товар'),
                    quantity: yup.number()
                        .typeError('Укажи количество товара')
                        .integer('Укажи целое число товаров')
                        .moreThan(0, 'Количество товаров должна быть больше 0')
                        .required('Укажи количество товара'),
                    probability: yup.number()
                        .typeError('Укажи вероятность выпадения')
                        .required('Укажи вероятность выпадения')
                        .moreThan(0, 'Вероятность должна быть больше 0')
                })}
                initialValues={{ ...product }}
                onSubmit={type === 'create'
                    ? this.onProductCreate
                    : this.onProductChange
                }
                render={({ touched, errors, values, setFieldValue, handleSubmit }) => (
                    <Form className={classNames(
                        overlayCSS.container,
                        'col-13',
                        'pl-m',
                        'pt-m',
                        'pr-m'
                    )}>
                        <div className="inline mb-m align-items-center">
                            <div className="font-size-large">Товар</div>
                            <div className="spacer" />
                            <div className={css.id}>ID: {values.id || '???'}</div>
                        </div>
                        <div className="inline justify-content-space-between">
                            <div className="col-6">
                                <Row className="position-relative">
                                    <Field>
                                        <Suggest
                                            status={touched.id && errors.id ? 'error' : null}
                                            hint={touched.id && errors.id as string}
                                            value={suggestValue}
                                            checkOnlySelectedIndex
                                            itemClassName={`${css.suggestOption} font-size-medium`}
                                            label="Название, slug или id товара"
                                            placeholder="Что ищем?"                                
                                            theme="light"
                                            filter={() => true}
                                            items={options}
                                            onInputChange={this.onShopItemsGet}
                                            onChange={(option: ISuggestOption) => {
                                                if (option.id) {
                                                    setFieldValue('id', option.id);
                                                    setFieldValue(`name.name.${area.lang}`, option.item.name[area.lang]);

                                                    const description = option.item.description
                                                        ? option.item.description[area.lang].text
                                                        : '';

                                                    setFieldValue(
                                                        `description.${area.lang}.textDescription.text`,
                                                        description
                                                    );

                                                    this.setState({
                                                        suggestValue: option
                                                    });
                                                }
                                            }}
                                            optionRenderer={this.renderOption}
                                        />
                                        {loaders.getShopItems && (
                                            <Spinner size="small" className={css.spinner} />
                                        )}
                                    </Field>
                                </Row>
                                <Row col>
                                    <div className="font-size-medium mb-s">Правила передачи</div>
                                    <RadioGroup
                                        key={product.id}
                                        className={css.transferRules}
                                        theme="light"
                                        data={this.state.transferRules}
                                        onClick={(value: number) => {
                                            this.onTransferRulesChange(value, () => {
                                                const rule = find(this.state.transferRules, { selected: true });

                                                setFieldValue(`description.${area.lang}.isTransportable`, rule.text);
                                            });
                                        }}
                                        mods={['direction-column']}
                                    />
                                    <div className="inline align-items-center mt-s">
                                        <Radio
                                            onChange={() => {
                                                this.onCustomTransferRuleChange(() => {
                                                    setFieldValue(
                                                        `description.${area.lang}.isTransportable`,
                                                        this.state.customTransferRuleText
                                                    );
                                                });
                                            }}
                                            selected={customTransferRuleActive}
                                            theme="light"
                                        />
                                        <Input
                                            disabled={!customTransferRuleActive}
                                            onChange={(customTransferRuleText: string) => {
                                                this.setState({ customTransferRuleText });
                                                setFieldValue(
                                                    `description.${area.lang}.isTransportable`,
                                                    customTransferRuleText
                                                );
                                            }}
                                            value={this.state.customTransferRuleText}
                                            inputClassName={css.customRuleInput}
                                            wrapperClassName={`${css.customRule} ml-xxs`}
                                            theme="light"
                                            placeholder="Кастомный вариант"
                                        />
                                    </div>
                                </Row>
                                <Row>
                                    <Field>
                                        <Input
                                            theme="light"
                                            label="Количество"
                                            placeholder="Укажи количество"
                                            value={String(values.quantity || '')}
                                            onChange={(quantity: string) => {
                                                setFieldValue('quantity', Number(quantity));
                                            }}
                                        />
                                    </Field>
                                    <Field className="ml-l">
                                        <Input
                                            theme="light"
                                            label="Вероятность"
                                            placeholder="Укажи вероятность"
                                            value={String(values.probability || '')}
                                            onChange={(probability: string) => {
                                                setFieldValue('probability', Number(probability));
                                            }}
                                        />
                                    </Field>
                                </Row>
                                {touched.quantity && errors.quantity && (
                                    <SimpleError className="text-align-left mt-s">
                                        {errors.quantity}
                                    </SimpleError>
                                )}
                                {touched.probability && errors.probability && (
                                    <SimpleError className="text-align-left mt-s">
                                        {errors.probability}
                                    </SimpleError>
                                )}
                                <Row>
                                    <Checkbox
                                        theme="light"
                                        checked={values.isMainPrize}
                                        label="Главный приз"
                                        onClick={(checked: boolean) => {
                                            setFieldValue('isMainPrize', checked)
                                        }}
                                    />
                                </Row>
                                <Row className="mt-xs">
                                    <Checkbox
                                        theme="light"
                                        checked={!values.description[area.lang].isRealMainPrize}
                                        label="Выдача руками"
                                        onClick={(checked: boolean) => {
                                            setFieldValue(`description.${area.lang}.isRealMainPrize`, !checked);
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
                                            onClick={this.onProductDelete}
                                            className={`${css.deleteButton} ml-xxs`}
                                        >
                                            Удалить товар
                                        </div>
                                    )}
                                </Row>
                            </div>
                            <div className="col-4">
                                {values.id && (
                                    <WheelPrize
                                        quantity={values.quantity}
                                        textDescription={get(values, `description.${area.lang}.textDescription.text`)}
                                        isTransportable={values.description[area.lang].isTransportable}
                                        name={values.name.name[area.lang]}
                                        src={imagesGroups.products.launcherProduct.replace('{id}', String(values.id))}
                                    />
                                )}
                            </div>
                        </div>
                    </Form>
                )}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    area: state.area.selected,
    imagesGroups: state.imagesGroups
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        getShopItems,
        ...bindActionCreators({
            createLootBoxComponent,
            changeLootBoxComponent,
            deleteLootBoxComponent
        }, dispatch)
    }
});

const WheelProductManagerWithConnect = connect(mapStateToProps, mapDispatchToProps)(WheelProductManager);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.webshop.getShopItems
    ]}>
        <WheelProductManagerWithConnect {...props} />
    </RequestTracker>
);
