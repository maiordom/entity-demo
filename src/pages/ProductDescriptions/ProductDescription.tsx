import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import { Tabs, TabPanel, Tab, TabList } from 'react-tabs';

import api from 'src/routes/api';
import { Error } from 'src/components/Form/Form';
import DocsEditor from 'rich-editor/docs/Editor';
import { IShopItem } from 'src/entities/ShopItems/models/ShopItem';
import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { savePatchnoteImages, ISavePatchnoteImagesParams } from 'src/entities/Documents/actions';
import Panel from 'src/components/Panel/Panel';
import Button from 'ui/lib/Button';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';
import { IRequest } from 'src/entities/RequestJournal/store';

import { saveShopItemDescription, ISaveShopItemDescriptionRequestParams } from 'src/entities/ShopItems/actions';
import { getShopItemDescription, IGetShopItemDescriptionRequestParams, IGetShopItemDescriptionResult } from 'src/entities/ShopItems/actions';

interface IProps {
    shopItem: IShopItem;
    localeKey: string;
    isLoading: boolean;
}

interface IState {
    isNewDescription: boolean;
    value: string;
}

interface IActions {
    actions: {
        getShopItemDescription: (params: IGetShopItemDescriptionRequestParams) => Promise<IGetShopItemDescriptionResult>;
        saveShopItemDescription: (params: ISaveShopItemDescriptionRequestParams) => void;
        savePatchnoteImages: (params: ISavePatchnoteImagesParams) => Promise<any>;
    };
}

export class ProductDescriptionPage extends React.PureComponent<IProps & IActions, IState> {
    state = { value: '', isNewDescription: true }
    editorRef: React.RefObject<DocsEditor> = React.createRef();
    imageFiles = {};

    componentDidMount() {
        const { shopItem: { serviceId, id } } = this.props;

        this.props.actions.getShopItemDescription({ serviceId, id }).then(({ isNewDescription, value }) => {
            this.setState({ isNewDescription, value });
        })
    }

    componentWillReceiveProps(nextProps) {
        const { shopItem: { serviceId, id } } = nextProps;

        if (id !== this.props.shopItem.id) {
            this.props.actions.getShopItemDescription({ serviceId, id }).then(({ isNewDescription, value }) => {
                this.setState({ isNewDescription, value });
            })
        }
    }

    handleSaveDescription = () => {
        const { shopItem: { serviceId, id, name }, localeKey } = this.props;
        const { isNewDescription } = this.state;

        this.props.actions.savePatchnoteImages({ files: this.imageFiles }).then((images) => {
            images.forEach((image) => {
                this.editorRef.current.changeImageUrl(image);
            })

            const body = { [localeKey]: JSON.stringify(this.editorRef.current.value) };

            this.props.actions.saveShopItemDescription({ serviceId, id, versionName: '1', name, body });
        })
    }

    handleImageChange = (file) => {
        this.imageFiles[file.name] = file;
    }

    render() {
        const { shopItem, localeKey, isLoading } = this.props;
        const { value } = this.state;

        return (<>
            <Title locator="product-title">Товар: {shopItem.name[localeKey]}</Title>
            <Inner className="mt-xl pb-xxl">
                <div className="ml-xl mr-xl">
                    <DocsEditor
                        value={value}
                        ref={this.editorRef}
                        onImageChange={this.handleImageChange}
                    />
                </div>
                <Panel>
                    <Button
                        locator="save-product-button"
                        isLoading={isLoading}
                        className="col-5"
                        theme="thin-black"
                        onClick={this.handleSaveDescription}
                    >
                        Сохранить
                    </Button>
                    <div className="ml-s">
                        <Error route={api.documents.addDocument} />
                        <Error route={api.documents.addVersion} />
                        <Error route={api.documents.publishVersion} />
                    </div>
                    <RequestStatus
                        className="ml-s"
                        render={() => 'Описание успешно опубликовано'}
                        route={api.documents.publishVersion}
                    />
                </Panel>
            </Inner>
        </>);
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getShopItemDescription,
        savePatchnoteImages,
        saveShopItemDescription
    }, dispatch)
});

export default connect(null, mapDispatchToProps)(ProductDescriptionPage);
