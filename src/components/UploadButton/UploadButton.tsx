import React from 'react';

import Button from 'ui/lib/Button';
import Loader from 'ui/lib/Loader';

import { Label } from 'src/components/Form/Form';

import css from './UploadButton.css';

export interface IProps {
    displayFileName?: boolean;
    isLoading?: boolean;
    type?: 'horizontal' | 'vertical';
    locator?: string;
    mods?: Array<string>;
    title?: string;
    label?: string;
    theme?: string;
    onChange?: (file: File) => void;
}

export interface IState {
    fileName?: string;
}

export default class UploadButton extends React.PureComponent<IProps, IState> {
    static defaultProps = {
        displayFileName: true,
        type: 'horizontal',
        mods: ['size-small', 'font-size-small'],
        theme: 'thin-black'
    };

    state = {
        fileName: ''
    };

    inputFileRef: HTMLInputElement;

    setInputFileRef = (ref: HTMLInputElement) => {
        this.inputFileRef = ref;
    }

    onChange = (event) => {
        const file: File = event.target.files[0];

        this.props.onChange(file);
        this.setState({ fileName: file.name });
        this.inputFileRef.value = '';
    }

    render() {
        const {
            displayFileName,
            title,
            label,
            theme,
            type,
            locator,
            isLoading,
            mods
        } = this.props;
        const { fileName } = this.state;
        const isVertical = type === 'vertical';

        return (<>
            {label && (<Label className="mb-s">{label}</Label>)}
            <div className={isVertical ? 'col' : 'inline align-items-center'}>
                {fileName && displayFileName && (
                    <div className={isVertical ? 'mb-s' : 'mr-s'}>{fileName}</div>
                )}
                <div className="inline align-items-center">
                    <Button
                        locator={locator}
                        theme={theme}
                        mods={mods}
                        className={css.container}
                    >
                        <input
                            ref={this.setInputFileRef}
                            onChange={this.onChange}
                            className={css.input}
                            type="file"
                        />
                        {title}
                    </Button>
                    {isLoading && <Loader size="small" className="ml-s" />}
                </div>
            </div>
        </>)
    }
}
