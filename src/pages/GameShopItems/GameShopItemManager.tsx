import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import classNames from 'classnames';
import uuidv4 from 'uuid/v4';

import Input from 'ui/lib/Input';
import Icon from 'ui/lib/Icon';
import Button from 'ui/lib/Button';
import Select from 'ui/lib/Select';

import { addGameShopItem, IAddGameShopItemRequestParams } from 'src/entities/GameShop/actions';
import { editGameShopItem, IEditGameShopItemRequestParams } from 'src/entities/GameShop/actions';
import { deleteGameShopItem, IDeleteGameShopItemRequestParams } from 'src/entities/GameShop/actions';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { Form, Row, Field } from 'src/components/Form/Form';
import api from 'src/routes/api';

import { IGameShopItem } from 'src/entities/GameShop/models/GameShopItem';
import { IStore } from 'src/store';
import { IOption } from 'src/components/Apps/Apps';

const typeOptions = [
    { id: 'subscription', value: 'Подписка' },
    { id: 'role', value: 'Роль' },
    { id: 'withExternalData', value: 'С внешними данными' }
];

const typeInfo = {
    subscription: {
        label: 'Количество дней подписки',
        field: 'days'
    },
    role: {
        label: 'Идентификатор роли',
        field: 'roleId'
    },
    withExternalData: {
        label: 'Данные в формате JSON',
        field: 'data'
    }
}

export interface IOwnProps {
    onClose: () => void;
    onEdit: () => void;
    onCreate: () => void;
    type: string;
    gameShopItem: IGameShopItem;
}

export interface IProps {
    app: IOption;
    loaders?: {
        addGameShopItem: boolean;
        editGameShopItem: boolean;
        deleteGameShopItem: boolean;
    };
}

interface IActions {
    actions: {
        addGameShopItem: (params: IAddGameShopItemRequestParams) => void;
        editGameShopItem: (params: IEditGameShopItemRequestParams) => void;
        deleteGameShopItem: (params: IDeleteGameShopItemRequestParams) => Promise<void>;
    };
}

interface IFormikGameShopItemManagerValues extends IGameShopItem {}

class FormikGameShopItemManager extends Formik<{}, IFormikGameShopItemManagerValues> {}

import css from 'src/components/Overlay/Overlay.css';

class GameShopItemManager extends React.PureComponent<IProps & IActions & IOwnProps, any> {
    onSubmit = async (values: IFormikGameShopItemManagerValues) => {
        const { type, app } = this.props;
    
        if (type === 'create') {
            await this.props.actions.addGameShopItem({
                item: values,
                toPartnerId: String(app.id)
            });
            this.props.onCreate();
        } else {
            await this.props.actions.editGameShopItem({
                item: values,
                toPartnerId: String(app.id)
            });
            this.props.onEdit();
        }
    };

    onDeleteGameShopItemClick = async () => {
        await this.props.actions.deleteGameShopItem({
            id: this.props.gameShopItem.id,
            toPartnerId: String(this.props.app.id)
        });
        this.props.onClose();
    };

    render() {
        const { type, loaders } = this.props;
        let { gameShopItem } = this.props;
        const actionTitle = type === 'create'
            ? 'Создать'
            : 'Редактировать';
        const title = type === 'create'
            ? 'Создать слово'
            : 'Редактировать слово';

        if (!gameShopItem) {
            gameShopItem = {
                id: uuidv4(),
                name: {
                    ru: '',
                    en: '',
                    pt: ''
                }
            };
        }

        return (
            <FormikGameShopItemManager
                initialValues={{
                    ...gameShopItem
                }}
                onSubmit={this.onSubmit}
                render={({ values, setFieldValue, handleSubmit }) => (
                    <Form className={classNames(
                        css.container,
                        'pl-l',
                        'pt-xl'
                    )}>
                        <div className="font-size-large mb-m">{title}</div>
                        <div className="col-6">
                            <Row className="mt-s">
                                <Field>
                                    <Input
                                        locator="id-input"
                                        label="id"
                                        disabled={type === 'edit'}
                                        placeholder="Укажи id"
                                        theme="light"
                                        value={values.id}
                                        onChange={(id: string) => {
                                            setFieldValue('id', id);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        theme="light"
                                        label="Категория"
                                        placeholder="Укажи id категории"
                                        value={values.categoryId}
                                        onChange={(categoryId: string) => {
                                            setFieldValue('categoryId', categoryId);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        theme="light"
                                        label="Максимальное кол-во предметов в стеке"
                                        placeholder="Укажи размер стека"
                                        value={values.stackSize}
                                        onChange={(stackSize: string) => {
                                            setFieldValue('stackSize', stackSize);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row col>
                                <div className="label">Дополнительные данные</div>
                                <Field>
                                    <Select
                                        theme="light"
                                        placeholder="Выбери тип данных"
                                        options={typeOptions}
                                        value={values.data && values.data.type}
                                        onChange={(value, option: IOption) => {
                                            setFieldValue('data', {});
                                            setFieldValue('data.type', option.id);
                                        }}
                                    />
                                </Field>
                            </Row>
                            {values.data && (
                                <Row>
                                    <Field>
                                        <Input
                                            key={values.data.type}
                                            label={typeInfo[values.data.type].label}
                                            theme="light"
                                            value={values.data[typeInfo[values.data.type].field]}
                                            placeholder="Данные типа"
                                            onChange={(value: string) => {
                                                setFieldValue(
                                                    `data.${typeInfo[values.data.type].field}`,
                                                    value
                                                );
                                            }}
                                        />
                                    </Field>
                                </Row>
                            )}
                            <Row>
                                <div className="font-size-medium">Название</div>
                            </Row>
                            <Row className="mt-s">
                                <Field>
                                    <Input
                                        locator="ru-name-input"
                                        iconWrapperClassName="flag-icon"
                                        iconCategory="flags"
                                        icon="RU"
                                        placeholder="Русское название"
                                        theme="light"
                                        value={values.name.ru}
                                        onChange={(name: string) => {
                                            setFieldValue('name.ru', name);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="en-name-input"
                                        iconWrapperClassName="flag-icon"
                                        iconCategory="flags"
                                        icon="EU"                                    
                                        placeholder="Английское название"
                                        theme="light"
                                        value={values.name.en}
                                        onChange={(name: string) => {
                                            setFieldValue('name.en', name);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row>
                                <Field>
                                    <Input
                                        locator="pt-name-input"
                                        iconWrapperClassName="flag-icon"
                                        iconCategory="flags"
                                        icon="BR"
                                        placeholder="Португальское название"
                                        theme="light"
                                        value={values.name.pt}
                                        onChange={(name: string) => {
                                            setFieldValue('name.pt', name);
                                        }}
                                    />
                                </Field>
                            </Row>
                        </div>
                        <div className={`${css.panel} justify-content-space-between`}>
                            <Button
                                locator="save-button"
                                type="submit"
                                isLoading={loaders.addGameShopItem || loaders.editGameShopItem}
                                onClick={handleSubmit}
                                className="col-6 flex-shrink-none"
                            >
                                {actionTitle}
                            </Button>
                            <div className={css.errorContainer}>
                                <RequestStatus
                                    errorConfig={{
                                        showDetails: true,
                                        className: css.error
                                    }}
                                    className="ml-s"
                                    render={(request, route) => {
                                        if (route === api.gameShop.addGameShopItem) {
                                            return 'Слово успешно добавлено в словарь';
                                        } else if (route === api.gameShop.editGameShopItem) {
                                            return 'Слово успешно отредактированно';
                                        }
                                    }}
                                    routes={[
                                        api.gameShop.addGameShopItem,
                                        api.gameShop.editGameShopItem,
                                        api.gameShop.deleteGameShopItem
                                    ]}
                                />
                            </div>
                            {type === 'edit' && (
                                <Button
                                    locator="remove-button"
                                    isLoading={loaders.deleteGameShopItem}
                                    onClick={this.onDeleteGameShopItemClick}
                                    className="remove-button"
                                    theme="thin-black"
                                >
                                    <Icon
                                        className="remove-button-icon"
                                        name="cross"
                                    />
                                </Button>
                            )}
                        </div>

                    </Form>
                )}
            />
        )
    }
}

const mapStateToProps = (state: IStore) => ({
    app: state.appsOptions.selected
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        addGameShopItem,
        editGameShopItem,
        deleteGameShopItem
    }, dispatch)
});

const GameShopItemManagerWithConnect = connect(mapStateToProps, mapDispatchToProps)(GameShopItemManager);

export default (props: IOwnProps) => (
    <RequestTracker loaders={[
        api.gameShop.addGameShopItem,
        api.gameShop.editGameShopItem,
        api.gameShop.deleteGameShopItem
    ]}>
        <GameShopItemManagerWithConnect {...props} />
    </RequestTracker>
);
