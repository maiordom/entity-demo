import React, { Component } from 'react';
import classNames from 'classnames';

import Icon from 'ui/lib/Icon'
import Spinner from 'ui/lib/Spinner';
import Button from 'ui/lib/Button';

interface IProps {
    onDrop: (file: File) => void;
    status: null | 'error' | 'loading';
}

interface IState {
    isVisible: boolean;
}

import css from './LootBoxDropArea.css';

export default class LootBoxDropArea extends Component<IProps, IState> {
    state = {
        isVisible: false
    };

    containerRef: React.RefObject<HTMLDivElement> = React.createRef();

    preventDefaults = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    dragleave = (event) => {
        if (this.state.isVisible && !this.containerRef.current.contains(event.relatedTarget)) {
            this.setState({ isVisible: false });
        }
    };

    dragenter = () => {
        if (!this.state.isVisible) {
            this.setState({ isVisible: true });
        }
    };

    drop = (event) => {
        const file = event.dataTransfer.files[0];

        this.props.onDrop(file);
    };

    bindEvents() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.containerRef.current.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        this.containerRef.current.addEventListener('dragleave', this.dragleave, false);
        this.containerRef.current.addEventListener('drop', this.drop, false);
        document.body.addEventListener('dragenter', this.dragenter, false);
    }

    unbindEvents() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.containerRef.current.removeEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        this.containerRef.current.removeEventListener('dragleave', this.dragleave, false);
        this.containerRef.current.removeEventListener('drop', this.drop, false);
        document.body.removeEventListener('dragenter', this.dragenter, false);
    }

    componentWillUnmount() {
        this.unbindEvents();
    }

    componentDidMount() {
        this.bindEvents();
    }

    hide = () => {
        this.setState({ isVisible: false });
    };

    render() {
        const { isVisible } = this.state;
        const { status } = this.props;

        return (
            <div ref={this.containerRef} className={classNames(
                css.container,
                isVisible && css.isVisible
            )}>
                <div className={css.inner}>
                    <Icon className={css.plus} category="controls" name="plus" />
                    <div className="mt-s mb-xxs">Добавить колесо</div>
                    <div className="font-size-small">Перетяни сюда CSV</div>
                    <div className={`${css.status} mt-s`}>
                        {status === 'loading' && (
                            <Spinner size="small" />
                        )}
                        {status === 'error' && (<>
                            <div>Что-то пошло не так, попробуй проверить CSV и загрузи еще раз</div>
                            <Button
                                onClick={this.hide}
                                theme="thin-black"
                                className="mt-xs"
                                mods={['size-small', 'font-size-small']}
                            >
                                Скрыть
                            </Button>
                        </>)}
                    </div>
                </div>
            </div>
        );
    }
}
