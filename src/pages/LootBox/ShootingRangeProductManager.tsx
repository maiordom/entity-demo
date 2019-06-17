import React, { PureComponent } from 'react';
import { Formik } from 'formik';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as yup from 'yup';

import Checkbox from 'ui/lib/Checkbox';
import Button from 'ui/lib/Button';
import Input from 'ui/lib/Input';
import Suggest from 'ui/lib/Suggest';
import Spinner from 'ui/lib/Spinner';

import { IOption } from 'src/entities/Apps/store';
import { ILootBoxComponent } from 'src/entities/LootBoxes/models/LootBox';
import { IAreaItem } from 'src/entities/Area/store';
import { IStore } from 'src/store';
import { IImagesGroups } from 'src/entities/ImagesGroups/store';
import { IShopItem } from 'src/entities/ShopItems/models/ShopItem';

import { Form, Row, Field, SimpleError } from 'src/components/Form/Form';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import ShootingRangePrize from './ShootingRangePrize';

import getShopItems, { IGetShopItemsRequestParams, IGetShopItemsResult } from 'src/entities/ShopItems/services/GetShopItems';
import { createLootBoxComponent, ICreateLootBoxComponentParams } from 'src/entities/LootBoxes/actions';
import { changeLootBoxComponent, IChangeLootBoxComponentParams } from 'src/entities/LootBoxes/actions';
import { deleteLootBoxComponent, IDeleteLootBoxComponentParams } from 'src/entities/LootBoxes/actions';

interface IFormikShootingRangeProductManagerValues extends ILootBoxComponent {}

class FormikShootingRangeProductManager extends Formik<{}, IFormikShootingRangeProductManagerValues> {}

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
    main: IShopItem;
    version: IShopItem;
}

import overlayCSS from 'src/components/Overlay/Overlay.css';
import css from './ShootingRangeProductManager.css';

import api from 'src/routes/api';

type TProps = IProps & IActions & IOwnProps;

class ShootingRangeProductManager extends PureComponent<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const { product } = props;

        this.state = {
            suggestValue: {
                value: '',
                id: null,
                version: null,
                main: null
            },
            product: product || this.getProductTemplate(),
            options: []
        };
    }

    getProductTemplate(): ILootBoxComponent {
        const { area: { lang } } = this.props;

        return {
            id: null,
            probability: null,
            quantity: null,
            isMainPrize: false,
            name: {
                name: { [lang]: '' },
                mainName: { [lang]: '' }
            }
        }
    }

    formRef: React.RefObject<FormikShootingRangeProductManager> = React.createRef();

    onProductCreate = (values: IFormikShootingRangeProductManagerValues) => {
        this.props.actions.createLootBoxComponent({
            lootBoxId: this.props.lootBoxId,
            component: values,
            projectName: this.props.projectName
        });
        this.props.onSubmit();
    };

    onProductChange = (values: IFormikShootingRangeProductManagerValues) => {
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
            serviceId: 'pb-ru',
            count: 100
        });

        let shopItems = [];

        items.forEach(item => {
            if (item.versions && item.versions.length) {
                const versions = item.versions.map(version => ({
                    id: version.id,
                    value: item.name[area.lang] + ' ' + version.name[area.lang],
                    main: item,
                    version
                }));

                shopItems = shopItems.concat(versions);
            }
        });

        this.setState({
            options: shopItems
        });
    };

    render() {
        const { suggestValue, options } = this.state;
        const { type, loaders, area, imagesGroups } = this.props;
        const { product } = this.state;
        const actionTitle = type === 'create'
            ? 'Создать'
            : 'Сохранить';

        return (
            <FormikShootingRangeProductManager
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
                        'col-14',
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
                                                    setFieldValue(`name.mainName.${area.lang}`, option.main.name[area.lang]);
                                                    setFieldValue(`name.name.${area.lang}`, option.version.name[area.lang]);

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
                            <div className="col-6">
                                {values.id && (
                                    <ShootingRangePrize
                                        priceDescription="Уникальный"
                                        title={values.name.mainName[area.lang]}
                                        lifetime={values.name.name[area.lang]}
                                        src={imagesGroups.products.launcherShootingrangeLarge.replace('{id}', String(values.id))}
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

const ShootingRangeProductManagerWithConnect = connect(mapStateToProps, mapDispatchToProps)(ShootingRangeProductManager);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.webshop.getShopItems
    ]}>
        <ShootingRangeProductManagerWithConnect {...props} />
    </RequestTracker>
);
