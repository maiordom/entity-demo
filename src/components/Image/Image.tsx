import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Spinner from 'ui/lib/Spinner';

import { IStore } from 'src/store';

interface IOwnProps {
    width?: number;
    height?: number;
    imageId: string;
    className?: string;
    imageType: string;
    imageGroup: string;
}

interface IProps {
    imageTemplate: string;
}

interface IState {
    imageUrl?: string;
    loading: boolean;
}

type TProps = IProps & IOwnProps;

import css from './Image.css';

class ImageComponent extends React.PureComponent<TProps, IState> {
    attempts: number = 5;
    state = {
        imageUrl: null,
        loading: false
    };

    constructor(props: TProps) {
        super(props);

        if (props.imageId) {
            this.state.loading = true;
            this.downloadImage();
        }
    }

    componentWillReceiveProps(nextProps: TProps) {
        if (nextProps.imageId && this.props.imageId !== nextProps.imageId) {
            this.setState({ imageUrl: null, loading: true }, () => {
                this.attempts = 5;
                this.downloadImage();
            });
        }
    }

    downloadImage() {
        const { imageType, imageTemplate, imageId } = this.props;
        const imageUrl = imageTemplate[imageType].replace('{id}', imageId);

        if (this.attempts === 0) {
            this.setState({ loading: false });
            return;
        }

        const image = new Image();
        image.onload = () => {
            this.setState({ imageUrl, loading: false });
        };
        image.onerror = () => {
            setTimeout(() => {
                --this.attempts;
                this.downloadImage();
            }, 1000);
        };
        image.src = imageUrl;
    }

    render() {
        const { className, width, height } = this.props;
        const { imageUrl, loading } = this.state;

        return (
            <div
                style={{ width, height }}
                className={classNames(css.container, className)}
            >
                {loading && (
                    <Spinner
                        size="small"
                        theme="light"
                    />
                )}
                {imageUrl && (
                    <img
                        width={width}
                        height={height}
                        src={imageUrl}
                        className={className}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: IStore, ownProps: IOwnProps) => ({
    imageTemplate: state.imagesGroups[ownProps.imageGroup]
});

export default connect(mapStateToProps)(ImageComponent);
