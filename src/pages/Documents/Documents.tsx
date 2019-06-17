import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import classNames from 'classnames';
import find from 'lodash/find';
import difference from 'lodash/difference';
import moment from 'moment';
import union from 'lodash/union';

import { Container, Title, Inner } from 'src/components/Layout/Layout';
import { IOption } from 'src/entities/Apps/store';
import VersionManager, { DocumentVersion } from './VersionManager'
import VersionsSidebar from './VersionsSidebar';
import DocumentPanel from './DocumentPanel';
import Loader from 'ui/lib/Loader';

import { addDocument, IAddDocumentRequestParams } from 'src/entities/Documents/actions'
import { documentReadSelector } from 'src/entities/Documents/selectors'
import { clearDocuments } from 'src/entities/Documents/actions'
import { getDocuments, IGetDocumentsRequestParams } from 'src/entities/Documents/actions'
import { getDocumentById, IGetDocumentByIdRequestParams } from 'src/entities/Documents/actions'
import { getVersions, IGetVersionsRequestParams } from 'src/entities/Documents/actions'
import { getVersionDetails, IGetVersionDetailsRequestParams } from 'src/entities/Documents/actions'
import { setActiveDocument, ISetActiveDocumentParams } from 'src/entities/Documents/actions'
import { setActiveVersion, ISetActiveVersionParams } from 'src/entities/Documents/actions'
import { setDocumentsSearch, ISetDocumentsSearchParams } from 'src/entities/Documents/actions'
import { saveDocument, ISaveDocumentRequestParams } from 'src/entities/Documents/actions'
import { saveVersion, ISaveVersionRequestParams } from 'src/entities/Documents/actions'
import { publishVersion, IPublishVersionParams } from 'src/entities/Documents/actions'
import { unpublishVersion, IUnpublishVersionParams } from 'src/entities/Documents/actions'
import { addVersion, IAddVersionRequestParams } from 'src/entities/Documents/actions'
import { deleteDocument, IDeleteDocumentRequestParams } from 'src/entities/Documents/actions'
import { clearErrors } from 'src/entities/RequestError/actions';

import { IStore } from 'src/store';
import { IDocumentsSearchState } from 'src/entities/Documents/store';
import { IDocument }  from 'src/entities/Documents/models/Document';
import { IDocumentsFilter }  from 'src/entities/Documents/services/GetDocuments';
import { IVersion, ILocale } from 'src/entities/Documents/models/Version';
import { IVersionDetails } from 'src/entities/Documents/models/VersionDetails';
import DocumentManager from './DocumentManager';
import DocumentsList from './DocumentsList';
export { IOption } from 'src/entities/Apps/store';
import { IAllowedIds } from 'src/entities/Documents/selectors';

interface IProps {
    localeKey: string;
    selectedDocument: IDocument;
    selectedVersion: IVersion | IVersionDetails;
    searchResult: { [key: string]: Array<IDocument> };
    selectedService?: string;
    claimsByServicesIds: IAllowedIds;
    search: IDocumentsSearchState;
}

const defaultLocale: ILocale = { ru: '', en: '', pt: '', br: '', eu: '' };

interface IActions {
    actions: {
        addDocument: (params: IAddDocumentRequestParams) => Promise<void>;
        addVersion: (params: IAddVersionRequestParams) => Promise<void>;
        clearDocuments: () => void;
        clearErrors: () => Promise<void>;
        deleteDocument: (params: IDeleteDocumentRequestParams) => Promise<void>;
        getDocuments: (params: IGetDocumentsRequestParams) => Promise<void>;
        getDocumentById: (params: IGetDocumentByIdRequestParams) => Promise<void>;
        setDocumentsSearch: (params: ISetDocumentsSearchParams) => Promise<void>;
        getVersions: (params: IGetVersionsRequestParams) => Promise<void>;
        getVersionDetails: (params: IGetVersionDetailsRequestParams) => Promise<IVersionDetails>;
        publishVersion: (params: IPublishVersionParams) => Promise<void>;
        setActiveDocument: (params: ISetActiveDocumentParams) => void;
        setActiveVersion: (params: ISetActiveVersionParams) => void;
        saveDocument: (params: ISaveDocumentRequestParams) => Promise<void>;
        saveVersion: (params: ISaveVersionRequestParams) => Promise<void>;
        unpublishVersion: (params: IUnpublishVersionParams) => Promise<void>;
    };
}

interface IState {
    contentType: string;
    deletedVersions: Array<number>;
    selectedVersion?: IVersion | IVersionDetails;
    selectedVersionBody?: ILocale;
    sidebarCollapsed: boolean;
}

const documentTypeOptions = [
    { value: 'Патчноуты', id: 'patchnote' },
    { value: 'Юрдоки', id: 'juristic' },
    { value: 'Что делать после покупки', id: 'webshopAfterPurchase' },
    { value: 'Нет типа', id: '' }
]

const newVersion: IVersion = {
    id: undefined,
    body: defaultLocale,
    version: '',
    name: defaultLocale,
    isPublished: false,
    date: moment().format(),
    whenCreated: undefined,
    whenModified: undefined,
    isDeleted: false,
    whenPublished: undefined,
    whenDeleted: undefined,
    deletedBy: undefined,
    publishedBy: undefined
}

const defaultDocumentsFilter: IDocumentsFilter = { from: 0 };

import css from './Documents.css';

class DocumentsPage extends React.Component<IProps & IActions, IState> {
    state = {
        contentType: '',
        deletedVersions: [],
        sidebarCollapsed: false,
        selectedVersion: this.props.selectedVersion,
        selectedVersionBody: defaultLocale,
    }

    private removeScrollListener;
    private containerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private sidebarRef: React.RefObject<HTMLDivElement> = React.createRef();
    private versionRef: DocumentVersion;
    private documentRef: React.RefObject<DocumentManager> = React.createRef();

    appOptions: Array<IOption> = [];

    componentDidMount() {
        const { claimsByServicesIds, search: { id, docType }, selectedService } = this.props;

        this.updateDocuments(claimsByServicesIds);
    }

    componentWillReceiveProps(nextProps: IProps & IActions) {
        const { claimsByServicesIds, selectedDocument } = nextProps;
        const previousSelectedDocument = this.props.selectedDocument;

        if (selectedDocument && (!previousSelectedDocument || selectedDocument.id !== previousSelectedDocument.id)) {
            this.props.actions.clearErrors();
            this.setState({ deletedVersions: [] });
            this.getDocumetVersions({
                documentId: selectedDocument.id,
                serviceId: selectedDocument.serviceId
            });
        }

        this.updateDocuments(claimsByServicesIds, this.props.claimsByServicesIds);
    }

    updateDocuments = (claimsByServicesIds: IAllowedIds, comparedServiceIds?: IAllowedIds) => {
        let documentsClean;

        for (const key in claimsByServicesIds) {
            const diff = comparedServiceIds ? difference(claimsByServicesIds[key], comparedServiceIds[key]).length : 1;
            let docType;

            switch (key) {
                case 'djr':
                    docType = 'juristic';
                    break;
                case 'dpr':
                    docType = 'patchnote';
                    break;
                case 'dwr':
                    docType = 'webshopAfterPurchase';
                    break;
            }

            if (diff) {
                if (!documentsClean) {
                    documentsClean = true;
                    this.props.actions.clearDocuments();
                }

                claimsByServicesIds[key].map((serviceId) => {
                    this.getDocumets({ docType }, serviceId);
                });
            }
        }
    }

    componentWillUnmount() {
        this.removeScrollListener && this.removeScrollListener();
    }

    onGetDocumentsClick = (event) => {
        event.preventDefault();

        const { search: { id, docType }, selectedService } = this.props;
        this.setState({ contentType: '' });
        if (id) {
            return this.getDocumetById(id);
        }

        this.getDocumets({ docType }, selectedService);
    }

    getDocumets = async (filter?: IDocumentsFilter, serviceId?: string) => {
        this.props.actions.getDocuments({
            serviceId,
            filter: { ...defaultDocumentsFilter, ...filter }
        });
    }

    getDocumetById = async (id: number) => {
        this.props.actions.clearDocuments();
        this.props.actions.getDocumentById({ id });
    }

    getDocumetVersions = async ({ documentId, serviceId }: { documentId: number, serviceId: string }) => {
        this.props.actions.getVersions({ documentId, serviceId });
    }

    handleChangeContentType = (contentType: string) => () => {
        this.setState({ contentType });
    }

    handleCollapseClick= () => { this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed }) };

    handleDeleteDocumentClick = () => {
        const { selectedDocument: { id, serviceId } } = this.props;

        this.props.actions.deleteDocument({ id, serviceId });
    }

    handleSaveDocumentClick = () => {
        this.documentRef.current.saveDocument();
    }

    handleSaveVersionClick = () => {
        this.versionRef.saveVersion();
    }

    handlePublishVersionClick = () => {
        this.versionRef.publishVersion();
    }

    handleUnpublishVersionClick = () => {
        this.versionRef.unpublishVersion();
    }

    onDocumentTabClick = (event) => {
        event.stopPropagation();

        const { id, serviceid } = event.currentTarget.dataset;

        this.props.actions.clearErrors();
        this.setState({ contentType: 'updateDocument', deletedVersions: [] });

        this.props.actions.setActiveDocument({ id: Number(id), serviceId: serviceid });
    }

    onIdChange = (value: string) => {
        this.props.actions.setDocumentsSearch({ id: Number(value) });
    }

    onTypeChange = (value: string, option: { id: 'patchnote' | 'juristic' }) => {
        this.props.actions.setDocumentsSearch({ docType: option.id });
    }

    onVersionTabClick = (event) => {
        event.stopPropagation();

        const { id } = event.currentTarget.dataset;
        const { selectedDocument, selectedVersion } = this.props;
        const { versions } = selectedDocument;
        const nextSelectedVersion = versions && find(versions, { id: Number(id) });

        this.props.actions.clearErrors();
        this.setState({ contentType: 'documentVersion', selectedVersionBody: defaultLocale });

        this.props.actions.setActiveVersion({ version: nextSelectedVersion });
        this.props.actions.getVersionDetails({
            documentId: selectedDocument.id,
            versionId: nextSelectedVersion.id
        }).then((version: IVersionDetails) => {
            this.setState({ selectedVersionBody: version.body });
        });
    }

    setVersionRef = (connectedComponent) => this.versionRef = connectedComponent && connectedComponent.getWrappedInstance();

    documentIsActive = () => {
        const { contentType } = this.state;

        return contentType === 'updateDocument' || this.versionIsActive() || contentType === 'addVersion';
    }

    onShowDeletedChange = (showDeletedVersions: boolean) => {
        this.props.actions.setDocumentsSearch({ showDeletedVersions })
    }

    handleAddVersion = ({ value, serviceId }) => {
        const { id } = this.props.selectedDocument;

        return this.props.actions.addVersion({ value: { ...value, documentId: id }, serviceId });
    }

    handleSaveVersion = (params) => this.props.actions.saveVersion(params);

    renderContent = (hasDocuments: boolean, hasVersions: boolean) => {
        const { localeKey, selectedVersion, selectedDocument, selectedService } = this.props;
        const { contentType, sidebarCollapsed, selectedVersionBody } = this.state;

        switch (contentType) {
            case 'documentVersion':
                return (
                    <VersionManager
                        localeKey={localeKey}
                        ref={this.setVersionRef}
                        contentType={contentType}
                        version={selectedVersion}
                        versionBody={selectedVersionBody}
                        onSave={this.handleSaveVersion}
                        document={selectedDocument}
                        onPublishVersion={this.props.actions.publishVersion}
                        onUnpublishVersion={this.props.actions.unpublishVersion}
                    />
                )
            case 'addDocument':
                return (
                    <DocumentManager
                        localeKey={localeKey}
                        ref={this.documentRef}
                        selectedServiceId={selectedService}
                        contentType={contentType}
                        document={undefined}
                        documentTypeOptions={documentTypeOptions}
                        onSave={this.props.actions.addDocument}
                    />
                )
            case 'updateDocument':
                return (
                    <DocumentManager
                        localeKey={localeKey}
                        ref={this.documentRef}
                        contentType={contentType}
                        document={selectedDocument}
                        documentTypeOptions={documentTypeOptions}
                        onSave={this.props.actions.saveDocument}
                    />
                )
            case 'addVersion':
            case 'addWebshopAfterPurchase':
                return (
                    <VersionManager
                        ref={this.setVersionRef}
                        localeKey={localeKey}
                        versionBody={defaultLocale}
                        onSave={this.handleAddVersion}
                        contentType={contentType}
                        version={newVersion}
                        document={selectedDocument}
                    />
                )
        }
    }

    versionIsActive = () => {
        const { contentType } = this.state;

        return contentType === 'documentVersion';
    }

    handleServiceTabClick = (serviceId: string) => {
        this.getDocumets({}, serviceId);
    }

    renderContentContainer = () => {
        const {
            claimsByServicesIds,
            localeKey,
            actions: { addDocument },
            selectedDocument,
            selectedVersion,
            searchResult: documents,
            search
        } = this.props;
        const { sidebarCollapsed, contentType, deletedVersions } = this.state;
        const hasDocuments = documents && !!Object.keys(documents).length;
        const hasVersions = hasDocuments && !!selectedDocument;
        const showVersions = selectedDocument && contentType !== 'addDocument';
        const unionServices = union(claimsByServicesIds.djr, claimsByServicesIds.dpr, claimsByServicesIds.dwr);

        if (!unionServices.length) { return <span>Нет прав на просмотр документов</span> }

        return (
                <>
                    <div
                        className={classNames(
                            css.sidebarContainer,
                            css.hasDocuments,
                            showVersions && css.hasVersions,
                            sidebarCollapsed && css.collapsed
                        )}
                        ref={this.sidebarRef}
                    >
                        <div className={css.hidden}>
                            <div className="mr-s pt-xs" >
                                <div className={classNames('col-4', css.scroll)}>
                                {unionServices.map((serviceId) => (
                                    <DocumentsList
                                        locator={`documents-list-${serviceId}`}
                                        selectedDocument={selectedDocument}
                                        serviceId={serviceId}
                                        localeKey={localeKey}
                                        documents={documents[serviceId]}
                                        onDocumentTabClick={this.onDocumentTabClick}
                                        onActionClick={this.handleChangeContentType('addDocument')}
                                    />
                                ))}
                                </div>
                            </div>
                            {showVersions && (
                                <div className={classNames('col-4', css.scroll)}>
                                    <VersionsSidebar
                                        locator="versions-sidebar"
                                        localeKey={localeKey}
                                        deletedVersions={deletedVersions}
                                        showDeleted={search.showDeletedVersions}
                                        active={this.versionIsActive()}
                                        onActionClick={this.handleChangeContentType('addVersion')}
                                        versions={selectedDocument && selectedDocument.versions}
                                        selectedVersion={selectedVersion}
                                        onVersionTabClick={this.onVersionTabClick}
                                    />
                                </div>
                            )}
                        </div>
                        {contentType && (
                            <div
                                className={classNames(css.collapse, sidebarCollapsed && css.revert)}
                                onClick={this.handleCollapseClick}
                            />
                        )}
                    </div>
                    <div className={classNames(
                        css.content,
                        hasDocuments && css.hasDocuments,
                        hasVersions && css.hasVersions,
                        sidebarCollapsed && css.collapsed
                    )}>
                        {this.renderContent(hasDocuments, hasVersions)}
                        <DocumentPanel
                            contentType={this.state.contentType}
                            selectedVersion={this.props.selectedVersion}
                            onDocumentDelete={this.handleDeleteDocumentClick}
                            onSaveDocument={this.handleSaveDocumentClick}
                            onSaveVersion={this.handleSaveVersionClick}
                            onPublish={this.handlePublishVersionClick}
                            onUnpublish={this.handleUnpublishVersionClick}
                        />
                    </div>
                </>
        )

    }

    render() {
        return (
            <Container>
                <Title>Документы{!this.props.claimsByServicesIds && <Loader className="ml-m" size="small" />}</Title>
                <Inner
                    className={classNames(
                        'mr-xl',
                        css.container
                    )}
                >
                    {this.renderContentContainer()}
                </Inner>
            </Container>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    selectedDocument: state.documents.selectedDocument,
    selectedVersion: state.documents.selectedVersion,
    searchResult: state.documents.searchResult,
    search: state.documents.searchState,
    selectedService: String(state.appsOptions.selected.id),
    claimsByServicesIds: documentReadSelector(state),
    localeKey: state.area.selected.lang
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        addDocument,
        addVersion,
        clearDocuments,
        clearErrors,
        deleteDocument,
        getDocuments,
        getVersions,
        getVersionDetails,
        getDocumentById,
        publishVersion,
        setActiveDocument,
        setActiveVersion,
        setDocumentsSearch,
        saveDocument,
        saveVersion,
        unpublishVersion
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsPage);
