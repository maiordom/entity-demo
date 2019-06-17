import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UploadButton, { IProps as IUploadButtonProps } from 'src/components/UploadButton/UploadButton';
import RequestTracker from 'src/components/RequestTracker/RequestTracker';

import api from 'src/routes/api';

import { uploadImage, IUploadImageRequestParams, IUploadImageResponse } from 'src/entities/Images/actions'; 

interface IOwnProps {
    imageGroup: string;
    onUploadImage: (params: { imageId: string; }) => void;
}

interface IProps {
    loaders: {
        uploadImage: boolean;
    };
}

interface IActions {
    actions: {
        uploadImage: (params: IUploadImageRequestParams) => Promise<IUploadImageResponse>;
    };
}

type TProps = IProps & IActions & IOwnProps & IUploadButtonProps;

export class UploadImageComponent extends React.PureComponent<TProps, {}> {
    static defaultProps = {
        title: 'Добавить изображение'
    };

    onChangeImage = (file: File) => {
        this.props.actions.uploadImage({
            imageGroup: this.props.imageGroup,
            file
        }).then(({ imageId }) => {
            this.props.onUploadImage({ imageId });
        });
    };

    render() {
        const { loaders, displayFileName, title } = this.props;

        return (
            <div className="inline align-items-center">
                <UploadButton
                    displayFileName={displayFileName}
                    isLoading={loaders.uploadImage}
                    type="vertical"
                    title={title}
                    onChange={this.onChangeImage}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ uploadImage }, dispatch)
});

const UploadImage = connect(null, mapDispatchToProps)(UploadImageComponent);

export default (props: IOwnProps & IUploadButtonProps) => (
    <RequestTracker loaders={[
        api.images.uploadImage
    ]}>
        <UploadImage {...props} />
    </RequestTracker>
);