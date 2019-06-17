import React, { PureComponent } from 'react';

import { ILootBox, ILootBoxVersion } from 'src/entities/LootBoxes/models/LootBox';

import LootBoxVersion from './LootBoxVersion';
import Overlay from 'src/components/Overlay/Overlay';
import LootBoxVersionManager from './LootBoxVersionManager';

export interface IProps {
    lootBox: ILootBox;
    className?: string;
    projectName: string;
}

interface IState {
    currentVersion: ILootBoxVersion;
    type: string;
}

import css from './LootBoxVersions.css';

export default class LootBoxVersions extends PureComponent<IProps, IState> {
    state = {
        currentVersion: null,
        type: 'create'
    };
    overlayLootBoxVersionManagerRef: React.RefObject<Overlay> = React.createRef();

    onLootBoxVersionManagerSubmit = () => {
        this.overlayLootBoxVersionManagerRef.current.toggleVisibility();
    };

    onVersionAdd = () => {
        this.setState({
            currentVersion: undefined,
            type: 'create'
        }, () => {
            this.overlayLootBoxVersionManagerRef.current.toggleVisibility(true);
        });
    };

    onVersionClick = (version: ILootBoxVersion) => {
        this.setState({
            currentVersion: version,
            type: 'edit'
        }, () => {
            this.overlayLootBoxVersionManagerRef.current.toggleVisibility(true);
        });
    };

    render() {
        const { currentVersion, type } = this.state;
        const { className } = this.props;
        const { versions, id } = this.props.lootBox;

        return (<>
            <div className={`${css.container} ${className}`}>
                <div className="mr-s">Версии</div>
                {versions.map(version => (
                    <LootBoxVersion
                        key={version.id}
                        version={version}
                        className="mr-xxs"
                        onClick={this.onVersionClick}
                    />
                ))}
                <div
                    onClick={this.onVersionAdd}
                    className={css.addVersion}
                >
                    + Добавить версию
                </div>
            </div>
            <Overlay
                ref={this.overlayLootBoxVersionManagerRef}
            >
                <LootBoxVersionManager
                    projectName={this.props.projectName}
                    type={type}
                    onSubmit={this.onLootBoxVersionManagerSubmit}
                    lootBoxId={id}
                    version={currentVersion}
                />
            </Overlay>
        </>);
    }
}