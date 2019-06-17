import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import classNames from 'classnames';

import RequestTracker, { IRequest } from 'src/components/RequestTracker/RequestTracker';
import Button from 'ui/lib/Button';

import { clearErrors } from 'src/entities/RequestError/actions';
import RequestStatus from 'src/components/RequestStatus/RequestStatus';

import api from 'src/routes/api';
import { IStore } from 'src/store';
import { IVersion } from 'src/entities/Documents/models/Version';
import { IVersionDetails } from 'src/entities/Documents/models/VersionDetails';

const css: any = require('./Documents.css');

export interface IProps {
    contentType?: string;
    localeKey?: string;
    loaders?: {
        addVersion: boolean;
        addDocument: boolean;
        deleteDocument: boolean;
        deleteVersion: boolean;
        getDocuments: boolean;
        getVersions: boolean;
        publishVersion: boolean;
        saveDocument: boolean;
        saveVersion: boolean;
        unpublishVersion: boolean;
        uploadImage: boolean;
    };
    onDocumentDelete?: () => void;
    onSaveDocument?: () => void;
    onSaveVersion?: () => void;
    onPublish?: () => void;
    onUnpublish?: () => void;
    selectedVersion?: IVersion | IVersionDetails;
}

class DocumentPanel extends React.Component<IProps, {}> {
    renderPanelContent = () => {
        const {
            contentType,
            loaders,
            onDocumentDelete,
            onPublish,
            onUnpublish,
            onSaveDocument,
            onSaveVersion,
            selectedVersion
        } = this.props;

        switch (contentType) {
            case 'documentVersion':
                return selectedVersion && selectedVersion.isDeleted ? null : (
                    <>
                        <Button
                            locator="documentVersion-save-document-button"
                            className="col-5"
                            theme="thin-black"
                            isLoading={loaders.saveVersion || loaders.uploadImage}
                            onClick={onSaveVersion}
                        >
                            Сохранить
                        </Button>
                        {selectedVersion && selectedVersion.id && (
                            selectedVersion.isPublished ? (
                                <Button
                                    locator="documentVersion-unpublish-document-button"
                                    className="col-7 ml-s"
                                    theme="thin-black"
                                    onClick={onUnpublish}
                                    isLoading={loaders.unpublishVersion}
                                >
                                    Снять с публикации
                                </Button>
                            ) : (
                                <Button
                                    locator="documentVersion-publish-document-button"
                                    className="col-5 ml-s"
                                    theme="thin-black"
                                    onClick={onPublish}
                                    isLoading={loaders.publishVersion}
                                >
                                    Опубликовать
                                </Button>
                            )
                        )}
                    </>
                )
            case 'addDocument':
                return (
                    <>
                        <Button
                            locator="addDocument-add-document-button"
                            className="col-5"
                            theme="thin-black"
                            isLoading={loaders.addDocument}
                            onClick={onSaveDocument}
                        >
                            Добавить
                        </Button>
                    </>
                )
            case 'updateDocument':
                return (
                    <>
                        <Button
                            locator="updateDocument-update-document-button"
                            className="col-5"
                            theme="thin-black"
                            isLoading={loaders.saveDocument}
                            onClick={onSaveDocument}
                        >
                            Сохранить
                        </Button>
                        <Button
                            locator="updateDocument-delete-document-button"
                            className="col-5 ml-s"
                            theme="thin-black"
                            isLoading={loaders.deleteDocument}
                            onClick={onDocumentDelete}
                        >
                            Удалить
                        </Button>
                    </>
                )
            case 'addVersion':
                return (
                    <>
                        <Button
                            locator="addVersion-add-document-button"
                            className="col-5"
                            theme="thin-black"
                            isLoading={loaders.addVersion || loaders.uploadImage}
                            onClick={onSaveVersion}
                        >
                            Добавить
                        </Button>
                    </>
                )
            case 'addWebshopAfterPurchase':
                return (
                    <>
                        <Button
                            locator="addWebshopAfterPurchase-add-document-button"
                            className="col-5"
                            theme="thin-black"
                            isLoading={loaders.addVersion}
                            onClick={onSaveVersion}
                        >
                            Добавить
                        </Button>
                    </>
                )
        }
    }

    componentWillReceiveProps(nextProps: IProps) {

    }


    render() {
        const { localeKey, contentType } = this.props;

        if (!contentType) { return null; }

        return (
            <div className={css.panelContainer}>
                <div className={css.panel}>
                    {this.renderPanelContent()}
                    <RequestStatus
                            errorConfig={{
                                showDetails: true,
                                className: css.error
                            }}
                            className="ml-s"
                            render={(request, route) => {
                                switch(route) {
                                    case api.documents.addDocument: {
                                        return 'Документ создан';
                                    }
                                    case api.documents.addVersion: {
                                        return 'Версия добавлена';
                                    }
                                    case api.documents.publishVersion: {
                                        return 'Версия опубликована';
                                    }
                                    case api.documents.unpublishVersion: {
                                        return 'Версия снята с публикации';
                                    }
                                    case api.documents.saveDocument: {
                                        return 'Документ сохранен';
                                    }
                                    case api.documents.saveVersion: {
                                        return 'Версия сохранена';
                                    }
                                }
                            }}
                            routes={[
                                api.documents.addDocument,
                                api.documents.addVersion,
                                api.documents.deleteDocument,
                                api.documents.getDocuments,
                                api.documents.publishVersion,
                                api.documents.saveDocument,
                                api.documents.saveVersion,
                                api.documents.unpublishVersion,
                                api.images.uploadImage
                            ]}
                        />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    localeKey: state.area.selected.lang
});

const DocumentPanelWithConnect = connect(mapStateToProps)(DocumentPanel);

export default (props: IProps) => (
    <RequestTracker
        loaders={[
            api.documents.addDocument,
            api.documents.addVersion,
            api.documents.deleteDocument,
            api.documents.deleteVersion,
            api.documents.getDocuments,
            api.documents.getVersions,
            api.documents.publishVersion,
            api.documents.saveDocument,
            api.documents.saveVersion,
            api.documents.unpublishVersion,
            api.images.uploadImage
        ]}
    >
        <DocumentPanelWithConnect {...props} />
    </RequestTracker>
)
