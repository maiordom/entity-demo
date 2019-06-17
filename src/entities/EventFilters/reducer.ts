import { handleActions } from 'redux-actions';
import { IAction } from 'src/types/IAction';
import { IStore } from 'src/store';
import xor from 'lodash/xor';
import find from 'lodash/find';

import * as a from './actions';
import { IEventFiltersPreset, NONE } from 'src/entities/EventFilters/store';

const handleMutationPresets = (state: IStore) => {
    const { eventFilters } = state;
    
    if (eventFilters.selectedPresetId !== NONE) {
        const preset: IEventFiltersPreset = find(eventFilters.presets, { id: eventFilters.selectedPresetId });
        
        if (xor(eventFilters.eventTypes, preset.eventTypes).length) {
            state.eventFilters.mutatedPresets[eventFilters.selectedPresetId] = {
                ...eventFilters.mutatedPresets[eventFilters.selectedPresetId],
                eventTypes: state.eventFilters.eventTypes
            };
        } else {
            delete state.eventFilters.mutatedPresets[eventFilters.selectedPresetId];
        }
    }
};

export default handleActions({
    [a.setEventsList.name]: (state: IStore, { payload: { eventsList, categories } }: IAction<a.ISetEventsListParams>) => {
        const mapTypeToName = {};
        
        Object.keys(eventsList).forEach((event) => {
            if (state.eventFilters.eventTypes.includes(event)) {
                eventsList[event].isActive = true;
            }

            mapTypeToName[event] = eventsList[event].name;
        });

        state.eventFilters.categories = { ...categories };
        state.eventFilters.eventsList = { ...eventsList };
        state.eventFilters.mapTypeToName = { ...mapTypeToName };

        return state;
    },
    [a.setFilterState.name]: (state: IStore, { payload: { type, isActive } }: IAction<a.ISetFilterStateParams>) => {
        const { eventFilters } = state;

        state.eventFilters.eventsList[type].isActive = isActive;
        state.eventFilters.eventsList = { ...eventFilters.eventsList };
        state.eventFilters.categories = { ...eventFilters.categories };

        if (isActive) {
            state.eventFilters.eventTypes = [ ...eventFilters.eventTypes, type];
        } else {
            state.eventFilters.eventTypes =  eventFilters.eventTypes.filter((event) => event !== type);
        }

        handleMutationPresets(state);

        return state;
    },
    [a.setFilterCategoryState.name]: (state: IStore, { payload: { category, isActive } }: IAction<a.ISetFilterCategoryStateParams>) => {
        state.eventFilters.categories[category].forEach((event) => {
            event.isActive = isActive;
        });
        state.eventFilters.categories = { ...state.eventFilters.categories };

        const categoryTypes = state.eventFilters.categories[category].map((event) => event.type);

        if (isActive) {
            state.eventFilters.eventTypes = [
                ...state.eventFilters.eventTypes,
                ...categoryTypes
            ]
        } else {
            state.eventFilters.eventTypes = state.eventFilters.eventTypes.filter((event) => !categoryTypes.includes(event));
        }

        handleMutationPresets(state);

        return state;
    },
    [a.setPresets.name]: (state: IStore, { payload: { presets } }: IAction<a.ISetPresetsParams>) => {
        state.eventFilters.presets = [ ...presets ];

        Object.keys(state.eventFilters.mutatedPresets).forEach((id) => {
            if (!find(presets, { id })) {
                delete state.eventFilters.mutatedPresets[id];
            }
        });

        return state;
    },
    [a.selectPreset.name]: (state: IStore, { payload: { id } }: IAction<a.ISelectPresetParams>) => {
        if (id !== NONE) {
            const preset: IEventFiltersPreset = find(state.eventFilters.presets, { id });
            const { eventsList } = state.eventFilters;
            let eventTypes = preset.eventTypes;

            if (state.eventFilters.mutatedPresets[preset.id]) {
                eventTypes = state.eventFilters.mutatedPresets[preset.id].eventTypes;
            }

            Object.keys(eventsList).forEach((event) => {
                eventsList[event].isActive = false;
    
                if (eventTypes.includes(eventsList[event].type)) {
                    eventsList[event].isActive = true;
                }
            });
            state.eventFilters.eventsList = { ...eventsList };
            state.eventFilters.categories = { ...state.eventFilters.categories };
            state.eventFilters.eventTypes = [ ...eventTypes ];
        }

        state.eventFilters.selectedPresetId = id;

        return state;
    },
    [a.setSelectedPreset.name]: (state: IStore, { payload: { id } }: IAction<a.ISelectPresetParams>) => {
        state.eventFilters.selectedPresetId = id;

        return state;
    },
    [a.unselectPreset.name]: (state: IStore) => {
        const { eventsList } = state.eventFilters;

        Object.keys(eventsList).forEach((event) => {
            eventsList[event].isActive = false;
        });
        state.eventFilters.eventTypes = [];
        state.eventFilters.eventsList = { ...eventsList };
        state.eventFilters.categories = { ...state.eventFilters.categories };
        state.eventFilters.selectedPresetId = NONE;

        return state;
    },
    [a.removeMutatedPreset.name]: (state: IStore, { payload: { id } }: IAction<a.IRemoveMutatedPresetParams>) =>{
        delete state.eventFilters.mutatedPresets[id];

        return state;
    }
}, {});
