import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import classNames from 'classnames';

import Button from 'ui/lib/Button';
import { IDocuments, IDocumentsSearchState } from 'src/entities/Documents/store';
import { IDocument }  from 'src/entities/Documents/models/Document';
import { IDocumentsFilter }  from 'src/entities/Documents/services/GetDocuments';
import { IVersion } from 'src/entities/Documents/models/Version';

export interface IProps {
    active: boolean;
    localeKey: string;
    locator?: string;
    onVersionTabClick: (event) => void;
    showDeleted: boolean;
    onActionClick: () => void;
    versions: Array<IVersion>;
    selectedVersion?: IVersion;
    showCollapse?: boolean;
    deletedVersions?: Array<number>;
}

import css from './Sidebar.css';

class VersionsSidebar extends React.PureComponent<IProps, {}> {
    renderVersionTabs() {
        const { active, localeKey, locator, deletedVersions, selectedVersion, versions } = this.props;

        return versions ? versions.map(({
            id,
            isPublished,
            isDeleted,
            name,
            whenCreated,
            whenPublished
        }: IVersion) => {
            const versionIsActive = active && selectedVersion && selectedVersion.id === id;
            const showDeleted = deletedVersions.includes(id);

            if (isDeleted && !this.props.showDeleted && !showDeleted) {
                return null;
            }

            return (
                <div
                    data-locator={`${locator}-document-name`}
                    className={classNames(
                        css.sidebarTab,
                        versionIsActive && css.activeSidebarTab,
                        isDeleted && css.deletedVersion,
                        showDeleted && css.deletedVersion,
                    )}
                    onClick={this.props.onVersionTabClick}
                    data-id={id}
                    key={id}
                >
                    <div className={classNames(css.versionBody)}>
                        {name ? (
                            <span
                                data-locator={`${locator}-version-name`}
                                dangerouslySetInnerHTML={{ __html: name[localeKey] }}
                                className={css.versionName}
                            />
                        ): '-'}
                    </div>
                    <div className={css.versionFooter}>
                        <span className={css.whenCreated}>{whenCreated}</span>
                        {isPublished ? ( <span data-locator={`${locator}-document-published`} className={css.isPublished} title="Опубликован" /> ) :
                        ( <span data-locator={`${locator}-document-unpublished`}className={css.isUnpublished} title="Неопубликован" /> )}
                    </div>
                </div>
            )
        }) : null;
    }

    render() {
        const { versions, showCollapse, onActionClick } = this.props;

        return (
            <>
                {this.renderVersionTabs()}
                <Button
                    locator="add-version-button"
                    className={classNames("ml-s", "mb-s", css.addDocumentButton)}
                    theme="thin-black"
                    mods={["size-small", "font-size-small"]}
                    onClick={onActionClick}
                >
                            Добавить
                </Button>
            </>
        );
    }
}

export default VersionsSidebar;
