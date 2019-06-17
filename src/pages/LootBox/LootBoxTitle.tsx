import React, { PureComponent } from 'react';
import classNames from 'classnames';

import Icon from 'ui/lib/Icon';
import Button from 'ui/lib/Button';

import css from './LootBoxTitle.css';

interface IProps {
    children: React.ReactText;
    onChange: (title: string) => void;
}

interface IState {
    isActive: boolean;
    title: React.ReactText;
}

export default class LootBoxTitle extends PureComponent<IProps, IState> {
    state = {
        isActive: false,
        title: this.props.children
    };

    editableRef: React.RefObject<HTMLDivElement> = React.createRef();

    show = () => {
        this.setState({ isActive: true }, () => {
            this.editableRef.current.focus();
        });
    };

    save = () => {
        const title = this.editableRef.current.textContent;

        this.setState({ title, isActive: false });
        this.props.onChange(title);
    };

    cancel = () => {
        this.setState({ isActive: false });
    };

    render() {
        const { isActive, title } = this.state;

        return (
            isActive
                ? <div>
                    <div
                        ref={this.editableRef}
                        contentEditable
                        className={classNames(
                            css.container,
                            css.editable
                        )}
                    >
                        {title}
                    </div>
                    <div className="mt-s">
                        <Button
                            onClick={this.save}
                            theme="thin-black"
                            mods={['size-small', 'font-size-small']}
                        >
                            Сохранить
                        </Button>
                        <Button
                            onClick={this.cancel}
                            className="ml-s"
                            theme="thin-black"
                            mods={['size-small', 'font-size-small']}
                        >
                            Отменить
                        </Button>
                    </div>
                </div>
                : <div
                    className={css.container}
                    onClick={this.show}
                >
                    <div className={css.text}>{title}</div>
                    <Icon
                        wrapperClassName={`${css.tool} ml-xxs`}
                        name="tool"
                    />
                </div>
        );
    }
}
