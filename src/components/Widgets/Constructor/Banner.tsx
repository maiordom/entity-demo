import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Select, { IOption } from 'ui/lib/Select';
import Input from 'ui/lib/Input';

import { Row, Field } from 'src/components/Form/Form';
import { IWidgetBanner } from 'src/entities/Content/store';
import { IStore } from 'src/store';
import { IAreaItem } from 'src/entities/Area/store';

import { WIDGET_TYPE_BANNER } from './Constructor';
import UploadImage from './UploadImage';

const targetOptions = [
    { id: 'product', value: 'Продукт' },
    { id: 'externalLink', value: 'Внешняя ссылка' },
    { id: 'patchnotes', value: 'Патчноуты' },
    { id: 'lottery', value: 'Лотерея' }
];

interface IProps {
    area: IAreaItem;
    widget: IWidgetBanner;
}

interface IState extends IWidgetBanner {}

import css from './Banner.css';

const TARGETS_WITH_DATA = ['product', 'externalLink'];

export class Banner extends React.PureComponent<IProps, IState> {
    state = cloneDeep(this.props.widget || {
        type: WIDGET_TYPE_BANNER,
        source: {
            label: {},
            title: {}
        }
    }) as IWidgetBanner;

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.widget !== this.props.widget) {
            this.setState({ ...cloneDeep(nextProps.widget) });
        }
    }

    getWidgetConfig = (): IWidgetBanner => cloneDeep(this.state);

    onChangeLabel = (value: string, key: string) => {
        this.setState({
            source: {
                ...this.state.source,
                label: {
                    ...this.state.source.label,
                    [key]: value
                }
            }
        });
    };

    onChangeData = (data: string) => {
        this.setState({ source: { ...this.state.source, data } });
    };

    onChangeTarget = (value: string, option: IOption) => {
        this.setState({ source: { ...this.state.source, target: option.id as any } });
    };

    onChangeTitle = (value: string, key: string) => {
        this.setState({
            source: {
                ...this.state.source,
                title: {
                    ...this.state.source.title,
                    [key]: value
                }
            }
        });
    };

    onUploadImage = ({ imageId }: { imageId: string; }) => {
        this.setState({ imageId });
    };

    render() {
        const { area } = this.props;
        const { title, label, data, target, imageUrl } = this.state.source;

        return (<>
            <div className="col-6">
                {imageUrl && (
                    <Row>
                        <div
                            className={css.image}
                            style={{ backgroundImage: `url(${imageUrl}` }}
                        />
                    </Row>
                )}
                <Row>
                    <UploadImage
                        imageGroup="widgets"
                        onUploadImage={this.onUploadImage}
                    />
                </Row>
                <Row>
                    <Field>
                        <Select
                            locator="link-type"
                            title="Тип ссылки"
                            placeholder="Выберите тип ссылки"
                            theme="light"
                            options={targetOptions}
                            onChange={this.onChangeTarget}
                            value={target}
                        />
                    </Field>
                </Row>
                {TARGETS_WITH_DATA.includes(this.state.source.target) && (
                    <Row>
                        <Field>
                            <Input
                                locator="product-or-link-input"
                                theme="light"
                                label="ID товара или внешняя ссылка"
                                placeholder="Текст"
                                value={data}
                                onChange={this.onChangeData}
                            />
                        </Field>
                    </Row>
                )}
            </div>
            <div className="col-6">
                <Row>
                    <Field>
                        <Input
                            locator="banner-title-input"
                            icon={area.id.toUpperCase()}
                            iconCategory="flags"
                            iconWrapperClassName="flag-icon"
                            theme="light"
                            label="Заголовок"
                            placeholder="Укажи заголовок"
                            value={title[area.lang]}
                            onChange={(title: string) => this.onChangeTitle(title, area.lang)}
                        />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Input
                            locator="input-banner-widget-label"
                            icon={area.id.toUpperCase()}
                            iconCategory="flags"
                            iconWrapperClassName="flag-icon"
                            theme="light"
                            label="Лейбл"
                            placeholder="Укажи лейбл"
                            value={label[area.lang]}
                            onChange={(label: string) => this.onChangeLabel(label, area.lang)}
                        />
                    </Field>
                </Row>
            </div>
        </>);
    }
}

const mapStateToProps = (state: IStore) => ({
    area: state.area.selected
});

export default connect(mapStateToProps, null, null, { withRef: true })(Banner);
