import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Formik } from 'formik';
import omit from 'lodash/omit';
import * as yup from 'yup';
import moment, { Moment } from 'moment';
import * as format from 'date-fns/format';
import ru from 'date-fns/locale/ru';
import en from 'date-fns/locale/en';
import pt from 'date-fns/locale/pt';

import { IDocument } from 'src/entities/Documents/models/Document';
import { IImage } from 'src/entities/Documents/models/VersionImage';
import { IVersion, ILocale } from 'src/entities/Documents/models/Version';
import { IVersionDetails } from 'src/entities/Documents/models/VersionDetails';
import {
    deletePatchnoteBanner,
    savePatchnoteImages,
    IDeletePatchnoteBannerParams,
    ISavePatchnoteImagesParams,
    ISavePatchnoteBannerParams,
    savePatchnoteBanner
} from 'src/entities/Documents/actions';
import {
    ISaveVersionRequestParams,
    IPublishVersionParams,
    IUnpublishVersionParams,
    IAddVersionRequestParams
} from 'src/entities/Documents/actions';
import PatchNoteEditor from 'rich-editor/patchNotes/Editor';
import DocsEditor from 'rich-editor/docs/Editor';

import Input from 'ui/lib/Input';
import Button from 'ui/lib/Button';
import RadioGroup, { IData } from 'ui/lib/RadioGroup';
import SingleDatePicker from 'src/components/Calendar/Calendar';
import { Row, Field, Inline, SimpleError } from 'src/components/Form/Form';

import css from './VersionManager.css';
const fieldExclude = ['whenCreated', 'whenDeleted', 'whenPublished', 'whenDeleted', 'whenModified'];

interface IProps {
    localeKey: string;
    contentType: string;
    document: IDocument;
    version: IVersion | IVersionDetails;
    versionBody?: ILocale;
    onSave?: (params: ISaveVersionRequestParams | IAddVersionRequestParams) => Promise<IVersion>;
    onPublishVersion?: (params: IPublishVersionParams) => void;
    onUnpublishVersion?: (params: IUnpublishVersionParams) => void;
}

interface IActions {
    actions?: {
        savePatchnoteImages: (params: ISavePatchnoteImagesParams) => Promise<Array<IImage>>;
        savePatchnoteBanner: (params: ISavePatchnoteBannerParams) => void;
        deletePatchnoteBanner: (params: IDeletePatchnoteBannerParams) => void;
    }
}

interface IFormikVersionDetailsValues {
    name?: string;
    version?: string;
    date?: string;
}

interface IState {
    isMetaCollapsed: boolean;
}

const imagePromises = {};

const dateLocale = { ru, en, pt }

const bannerTypes: Array<IData> = [{
    value: 'text',
    text: 'Текст'
}, {
    value: 'image',
    text: 'Картинка'
}];

class FormikVersionDetails extends Formik<{}, IFormikVersionDetailsValues> {}

export class DocumentVersion extends React.Component<IProps & IActions, IState> {
    private editorRef: React.RefObject<PatchNoteEditor | DocsEditor> = React.createRef();
    private formRef: React.RefObject<FormikVersionDetails> = React.createRef();
    private imageFiles: { [key: string]: IImage } = {};
    private galleryFiles: { [key: string]: IImage } = {};
    private bannerImage: IImage;
    private deleteBanner: boolean = false;

    state = { isMetaCollapsed: false }

    handleImageChange = (file: IImage, type: string) => {
        if (type === 'banner') {
            this.bannerImage = file;
            this.deleteBanner = false;
        }

        if (type === 'gallery') {
            this.galleryFiles[file.name] = file;
        }

        this.imageFiles[file.name] = file;
    }

    handleBannerDelete = () => {
        this.bannerImage = null;
        this.deleteBanner = true;
    }

    saveVersion = async () => {
        const { localeKey, onSave, version } = this.props;
        const values = this.formRef.current.getFormikBag().values;

        const value = omit({
            ...version,
            ...values,
            name: { [localeKey]: values.name }

        }, fieldExclude);

        const formErrors = await this.formRef.current.runValidations() || {};

        if (!Object.keys(formErrors).length) {
            const patchnoteImages = await this.props.actions.savePatchnoteImages({ files: this.imageFiles });
            const galleryImages = await this.props.actions.savePatchnoteImages({ files: this.galleryFiles });

            patchnoteImages.forEach((image: IImage) => {
                this.editorRef.current.changeImageUrl(image);
            })

            this.editorRef.current.changeGalleryImageUrls(galleryImages);

            value.body = { [localeKey]: JSON.stringify(this.editorRef.current.value) };

            const version = await this.props.onSave({ value })
            const id = version ? version.id : this.props.version.id;

            if (this.deleteBanner) {
                await this.props.actions.deletePatchnoteBanner({ id });
            }

            if (this.bannerImage) {
                await this.props.actions.savePatchnoteBanner({ file: this.bannerImage.data, id });
            }

            this.bannerImage = null;
            this.deleteBanner = false;
            this.galleryFiles = {};
            this.imageFiles = {};

            return version;
        }
    }

    renderEditor = () => {
        const { localeKey, document, version, versionBody } = this.props;

        if (!document) { return null; }

        const EditorComponent = document.type === 'patchnote' ? PatchNoteEditor : DocsEditor;

        return (
            <EditorComponent
                className={css.editorHolder}
                onImageChange={this.handleImageChange}
                onBannerDelete={this.handleBannerDelete}
                ref={this.editorRef}
                title={version.name[localeKey]}
                date={format(version.date, 'DD MMMM YYYY', { locale: dateLocale[localeKey] })}
                description={version.version}
                value={versionBody[localeKey] || ''}
            />
        )
    }

    publishVersion = () => {
        const { document, onPublishVersion, version } = this.props;

        return onPublishVersion({ documentId: document.id, version });
    }

    unpublishVersion = () => {
        const { document, onUnpublishVersion, version } = this.props;

        return onUnpublishVersion({ documentId: document.id, version });
    }

    toggleMeta = () => {
        this.setState({ isMetaCollapsed: !this.state.isMetaCollapsed });
    }

    render() {
        const { localeKey, contentType, document, onPublishVersion, onUnpublishVersion, version } = this.props;
        const { isMetaCollapsed } = this.state;

        if (!version) { return null; }

        return (
            <div className={classNames(css.versionForm)}>
                <FormikVersionDetails
                    ref={this.formRef}
                    initialValues={{
                        name: version.name[localeKey],
                        version: version.version,
                        date: version.date
                    }}
                    enableReinitialize
                    validationSchema={yup.object().shape({
                        name: yup.string().required('Необходимо заполнить название'),
                        date: yup.string().required('Необходимо указать дату')
                    })}
                    onSubmit={() => {}}
                    render={({ values, setFieldValue, errors }) => (<>
                        <div className={classNames(css.metaContainer, isMetaCollapsed && css.collapsed)}>
                            <Row className={css.metaControl}>
                                <div className={css.published}>
                                    {version.isPublished ? 'ОПУБЛИКОВАН' : 'НЕ ОПУБЛИКОВАН'}
                                </div>
                                <Button
                                    theme="thin-black"
                                    mods={['size-small', 'font-size-small']}
                                    onClick={this.toggleMeta}
                                >
                                    {isMetaCollapsed ? 'Развернуть': 'Свернуть'}
                                </Button>
                            </Row>
                            <Row className="mt-s">
                                <Field>
                                    <Input
                                        locator="version-manager-name"
                                        label="Название"
                                        theme="light"
                                        placeholder="Укажи название"
                                        value={values.name}
                                        onChange={(name: string) => {
                                            setFieldValue('name', name);
                                        }}
                                    />
                                    {errors.name && (
                                        <SimpleError className="text-align-left mt-s">{errors.name}</SimpleError>
                                    )}
                                </Field>
                            </Row>
                            <Row className={css.inputsContainer}>
                                <Field className="mr-m">
                                    <Input
                                        locator="version-manager-version"
                                        label="Версия"
                                        theme="light"
                                        placeholder="Укажи версию"
                                        value={values.version}
                                        onChange={(version: string) => {
                                            setFieldValue('version', version)
                                        }}
                                    />
                                </Field>
                                <Field className={css.dateBlock}>
                                    <div className="label">Дата</div>
                                    <SingleDatePicker
                                        locator="version-manager-date"
                                        date={moment(values.date).format()}
                                        isOutsideRange={() => false}
                                        placeholder="Дата"
                                        onChange={(momentDate: Moment) => {
                                            const date: string = momentDate && momentDate.format() || '';

                                            setFieldValue('date', date);
                                        }}
                                        showClearDate
                                    />
                                    {errors.date && (
                                        <SimpleError className="text-align-left mt-s">{errors.date}</SimpleError>
                                    )}
                                </Field>
                            </Row>
                            {contentType === 'updateVersion' && (<>
                                <Row>
                                    <div className={`${css.dataContainer} col-4`}>
                                        <span>Опубликован</span>
                                        <span>{version.isPublished ? 'Да' :  'Нет'}</span>
                                    </div>
                                    <div className={`${css.dataContainer} col-4`}>
                                        <span>Удален</span>
                                        <span>{version.isDeleted ? 'Да' : 'Нет'}</span>
                                    </div>
                                </Row>
                                <Row>
                                    {version.whenCreated && (
                                        <div className={`${css.dataContainer} col-4`}>
                                            <span>Дата создания</span>
                                            <span>{version.whenCreated}</span>
                                        </div>
                                    )}
                                    {version.whenModified && (
                                        <div className={`${css.dataContainer} col-4`}>
                                            <span>Дата изменения</span>
                                            <span>{version.whenModified}</span>
                                        </div>
                                    )}
                                    {version.whenPublished && (
                                        <div className={`${css.dataContainer} col-4`}>
                                            <span>Дата публикации</span>
                                            <span>{version.whenPublished}</span>
                                        </div>
                                    )}
                                    {version.publishedBy && (
                                        <div className={`${css.dataContainer} col-4`}>
                                            <span>Опубликовал</span>
                                            <span>{version.publishedBy}</span>
                                        </div>
                                    )}
                                </Row>
                            </>)}
                        </div>
                        <Row className={classNames(css.editorContainer, !isMetaCollapsed && css.collapsed)}>
                            {this.renderEditor()}
                        </Row>
                    </>)}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        deletePatchnoteBanner,
        savePatchnoteBanner,
        savePatchnoteImages
    }, dispatch)
});

export default connect(null, mapDispatchToProps, null, { withRef: true })(DocumentVersion);
