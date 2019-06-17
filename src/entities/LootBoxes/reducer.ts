import { handleActions } from 'redux-actions';
import findIndex from 'lodash/findIndex';
import reject from 'lodash/reject';
import moment from 'moment';

import * as a from './actions';
import { IAction } from 'src/types/IAction';
import { IStore } from 'src/store';

import { ILootBox } from 'src/entities/LootBoxes/models/LootBox';

export default handleActions({
    [a.setLootBoxes.name]: (state: IStore, { payload: { items, projectName } }: IAction<a.ISetLootBoxesParams>) => {
        state.lootBoxes[projectName] = { ...state.lootBoxes[projectName] };
        state.lootBoxes[projectName].items = items;
        return state;
    },

    [a.setLootBox.name]: (state: IStore, { payload: { lootBox, projectName } }: IAction<a.ISelectLootBoxParams>) => {
        state.lootBoxes[projectName].opened[lootBox.id] = lootBox;
        return state;
    },

    [a.changeLootBoxVersion.name]: (state: IStore, { payload: { lootBoxId, version, newVersion, projectName } }: IAction<a.IChangeLootBoxVersionParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];
        const versionIndex = findIndex(lootBox.versions, item => item === version);

        lootBox.versions[versionIndex] = newVersion;

        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox };

        return state;
    },

    [a.deleteLootBoxVersion.name]: (state: IStore, { payload: { lootBoxId, version, projectName } }: IAction<a.IDeleteLootBoxVersionParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];

        lootBox.versions = reject(lootBox.versions, item => item === version);

        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox };

        return state;
    },

    [a.checkLootBoxVisibility.name]: (state: IStore, { payload: { lootBoxId, projectName } }: IAction<a.ICheckLootBoxVisibilityParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];

        const isVisibleForPlayers = lootBox.versions.length > 0;

        if (!lootBox.withdrawn && !isVisibleForPlayers) {
            lootBox.withdrawn = true;
        }

        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox };

        return state;
    },

    [a.createLootBoxVersion.name]: (state: IStore, { payload: { lootBoxId, version, projectName } }: IAction<a.ICreateLootBoxVersionParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];

        lootBox.versions.push(version);
        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox };

        return state;
    },

    [a.changeLootBoxComponent.name]: (state: IStore, { payload: { lootBoxId, component, newComponent, projectName } }: IAction<a.IChangeLootBoxComponentParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];
        const currentComponentIndex = findIndex(lootBox.components, { id: component.id });

        if (currentComponentIndex !== -1) {
            lootBox.components = [...lootBox.components];
            lootBox.components[currentComponentIndex] = newComponent;
        }

        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox };

        return state;
    },

    [a.deleteLootBoxComponent.name]: (state: IStore, { payload: { lootBoxId, component, projectName } }: IAction<a.IDeleteLootBoxComponentParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];

        lootBox.components = reject(lootBox.components, { id: component.id });
        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox };

        return state;
    },

    [a.createLootBoxComponent.name]: (state: IStore, { payload: { lootBoxId, component, projectName } }: IAction<a.ICreateLootBoxComponentParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];

        lootBox.components = [...lootBox.components];
        lootBox.components.push(component);

        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox };

        return state;
    },

    [a.changeLootBoxParams.name]: (state: IStore, { payload: { lootBoxId, changes, projectName } }: IAction<a.IChangeLootBoxParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];

        if (changes.id) {
            delete state.lootBoxes[projectName].opened[lootBoxId];
        }

        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox, ...changes };

        return state;
    },

    [a.moveLootBoxComponent.name]: (state: IStore, { payload: { lootBoxId, from, to, projectName } }: IAction<a.IMoveLootBoxComponentParams>) => {
        const lootBox: ILootBox = state.lootBoxes[projectName].opened[lootBoxId];
        const { components } = lootBox;
        const fromIndex = findIndex(components, { id: from });
        const toIndex = findIndex(components, { id: to });
        const component = components[fromIndex];

        components.splice(fromIndex, 1);

        if (fromIndex < toIndex) {
            lootBox.components = [...components.slice(0, toIndex), component, ...components.slice(toIndex)];
        } else {
            lootBox.components = [...components.slice(0, toIndex + 1), component, ...components.slice(toIndex + 1)];
        }

        state.lootBoxes[projectName].opened[lootBoxId] = { ...lootBox };

        return state;
    }
}, {});
