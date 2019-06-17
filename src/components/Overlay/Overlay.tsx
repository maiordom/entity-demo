import React, { Fragment } from 'react';
import classnames from 'classnames';

import css from './Overlay.css';

interface IProps {
    mod?: string;
    isVisible?: boolean;
    onChange?: (state: boolean) => void;
}

interface IState {
    isVisible: boolean;
    isDisplay: boolean;
}

export default class Overlay extends React.PureComponent<IProps, IState> {
    static defaultProps = {
        mod: 'primary'
    };

    state = {
        isVisible: this.props.isVisible,
        isDisplay: this.props.isVisible
    };

    containerRef: React.RefObject<HTMLDivElement> = React.createRef();

    onClick = (event) => {
        if (event.target === this.containerRef.current) {
            this.toggleVisibility();
            this.props.onChange && this.props.onChange(false);
        }

        event.stopPropagation();
    };

    isVisible = () => this.state.isVisible;

    toggleVisibility(visibility?: boolean) {
        if (visibility) {
            this.setState({ isDisplay: true }, () => {
                setTimeout(() => {
                    this.setState({ isVisible: true });
                }, 0);
            });
        } else {
            this.setState({ isVisible: false }, () => {
                setTimeout(() => {
                    this.setState({ isDisplay: false });
                }, 200);
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isVisible !== this.props.isVisible) {
            this.toggleVisibility(nextProps.isVisible);
        }
    }

    render() {
        const { children, mod } = this.props;
        const { isVisible, isDisplay } = this.state;

        if (!isDisplay) {
            return null;
        }

        return (<>
            <div
                ref={this.containerRef}
                className={classnames(
                    css[mod],
                    css.paranja,
                    isVisible && css.visible
                )}
                onClick={this.onClick}
            />
            <div className={classnames(
                css[mod],
                css.content,
                isVisible && css.visibleContent
            )}>
                {children}
            </div>
        </>);
    }
}
