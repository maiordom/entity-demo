import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import classNames from 'classnames';
import find from 'lodash/find';

import Button from 'ui/lib/Button';
import { IDocuments, IDocumentsSearchState } from 'src/entities/Documents/store';
import { IDocument }  from 'src/entities/Documents/models/Document';
import { IDocumentsFilter }  from 'src/entities/Documents/services/GetDocuments';
import { IVersion } from 'src/entities/Documents/models/Version';
import Icon from 'ui/lib/Icon';

export interface IProps {
    active?: number
    serviceId: string;
    locator?: string;
    localeKey?: string;
    documents: Array<IDocument>;
    selectedDocument?: IDocument;
    onActionClick?: () => void;
    onServiceTabClick?: (serviceId: string) => void;
    onDocumentTabClick?: (event) => void;
}

export interface IState {
    isOpen: boolean;
}

const documentLocales = {
    webshopAfterPurchase: {
        default: 'Что делать после покупки'
    },
    patchnote: {
        default: 'Патчноуты'
    },
    juristic: {
        default: 'Юрдок',
        components: 'Доп. компоненты',
        license: 'Лицензия'
    }
}

import css from './Sidebar.css';

export default class DocumentsList extends React.PureComponent<IProps , IState> {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true
        }
    }

    handleLabelClick = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    renderDocuments () {
        const { active, documents, localeKey, selectedDocument, onActionClick } = this.props;
        const { isOpen } = this.state;

        if (!documents) { return null; }

        return documents.map((document: IDocument) => {
            const documentActive = selectedDocument && selectedDocument.id === document.id

            if (document.type === 'webshopDescription') { return null; }

            let documentName = document.tag ? documentLocales[document.type][document.tag] : documentLocales[document.type]['default'];

            if(!documentName) {
                documentName = document.name[localeKey];
            }

            return (
                <span
                    data-locator={`document-${document.serviceId}-${document.id}`}
                    className={classNames(css.documentTab, documentActive && css.activeSidebarTab)}
                    onClick={this.props.onDocumentTabClick}
                    data-id={document.id}
                    data-serviceid={document.serviceId}
                    key={document.id}
                >
                    {documentName}
                </span>
            );
        });
    }

    render() {
        const { documents, onActionClick, selectedDocument, serviceId, locator } = this.props;
        const { isOpen } = this.state;

        return (
            <div className={classNames(css.documentsList, isOpen && css.opened)} >
                <div className={css.scroll}>
                    <span onClick={this.handleLabelClick} className={css.serviceTab}>
                        {serviceId} <Icon className={classNames('ml-xs', css.arrow, isOpen && css.opened)} name="arrow-up" />
                    </span>
                    {isOpen && (
                        <div>
                            {this.renderDocuments()}
                            <Button
                                locator={`add-document-${serviceId}`}
                                className={classNames("ml-s", css.addDocumentButton)}
                                theme="thin-black"
                                mods={["size-small", "font-size-small"]}
                                onClick={this.props.onActionClick}
                            >
                                Добавить
                            </Button>
                        </div>
                    )}
                </div>
            </div >
        );
    }
}
