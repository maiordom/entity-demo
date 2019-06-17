import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Input from 'ui/lib/Input';
import Select from 'ui/lib/Select';

import { IWidgetVideo } from 'src/entities/Content/store';

import { Row, Field } from 'src/components/Form/Form';

import { WIDGET_TYPE_VIDEO } from './Constructor';
import { IStore } from 'src/store';
import { IAreaItem } from 'src/entities/Area/store';

import UploadImage from './UploadImage';

export interface IProps {
    area: IAreaItem;
    widget: IWidgetVideo;
}

interface IState extends IWidgetVideo {}

const widgetTypes = [
    { id: 'youtube', value: 'youtube' },
];

export class Video extends React.PureComponent<IProps, IState> {
    state = cloneDeep(this.props.widget || {
        type: WIDGET_TYPE_VIDEO,
        source: {
            source: 'youtube',
            text: {}
        }
    }) as IWidgetVideo;

    getWidgetConfig = (): IWidgetVideo => cloneDeep(this.state);

    onChangeText = (value: string, key: string) => {
        this.setState({
            source: {
                ...this.state.source,
                text: {
                    ...this.state.source.text,
                    [key]: value
                }
            }
        });
    };

    onChangeLink = (link: string) => {
        this.setState({ source: { ...this.state.source, link } });
    };

    onUploadImage = ({ imageId }: { imageId: string }) => {
        this.setState({ imageId });
    };

    render() {
        const { area } = this.props;
        const { text, source, link } = this.state.source;

        return (
            <div className="col-6">
                <Row>
                    <UploadImage
                        imageGroup="widgets"
                        onUploadImage={this.onUploadImage}
                    />
                </Row>
                <Row>
                    <Field>
                        <Input
                            locator="video-title-input"
                            icon={area.id.toUpperCase()}
                            iconCategory="flags"
                            iconWrapperClassName="flag-icon"
                            label="Заголовок"
                            placeholder="Укажи заголовок"
                            value={text[area.lang]}
                            theme="light"
                            onChange={(text: string) => this.onChangeText(text, area.lang)}
                        />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Select
                            locator="video-type-select"
                            title="Тип видео"
                            placeholder="Выберите тип"
                            theme="light"
                            options={widgetTypes}
                            value={source}
                        />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Input
                            locator="video-link-input"
                            label="Ссылка на видео"
                            placeholder="Укажи ссылку на видос"
                            value={link}
                            theme="light"
                            onChange={this.onChangeLink}
                        />
                    </Field>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    area: state.area.selected
});

export default connect(mapStateToProps, null, null, { withRef: true })(Video);
