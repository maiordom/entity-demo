import find from 'lodash/find';

import {
    IEventFiltersCategories,
    IEventsList,
    IEventFiltersPreset
} from './store';
import { createAction } from 'src/utils/CreateAction';
import { getEventsList as getEventsListService } from './services/GetEventsList';
import { getPresets as getPresetsService } from './services/GetPresets';
import { addPreset as addPresetService } from './services/AddPreset';
import { removePreset as removePresetService } from './services/RemovePreset';
import { savePreset as savePresetService } from './services/SavePreset';
import { IStore } from 'src/store';

export interface ISetEventsListParams { categories: IEventFiltersCategories; eventsList: IEventsList; }
export interface ISetFilterStateParams { type: string; isActive: boolean; }
export interface ISetFilterCategoryStateParams { category: string; isActive: boolean; }
export interface ISetPresetsParams { presets: Array<IEventFiltersPreset>; }
export interface ISelectPresetParams { id: number; }
export interface IRemoveMutatedPresetParams { id: number; }
export interface IAddPresetParams { name: string; }

export const {
    setEventsList,
    setFilterState,
    setFilterCategoryState,
    setPresets,
    selectPreset,
    setSelectedPreset,
    unselectPreset,
    removeMutatedPreset,
} = {
    setEventsList: (params: ISetEventsListParams) => createAction('setEventsList', params),
    setFilterState: (params: ISetFilterStateParams) => createAction('setFilterState', params),
    setFilterCategoryState: (params: ISetFilterStateParams) => createAction('setFilterCategoryState', params),
    setPresets: (params: ISetPresetsParams) => createAction('setPresets', params),
    selectPreset: (params: ISelectPresetParams) => createAction('selectPreset', params),
    setSelectedPreset: (params: ISelectPresetParams) => createAction('setSelectedPreset', params),
    unselectPreset: () => createAction('unselectPreset'),
    removeMutatedPreset: (params: IRemoveMutatedPresetParams) => createAction('removeMutatedPreset', params),
};

export const getEventsList = () => async (dispatch) => {
    const { eventsList, categories } = await getEventsListService();

    dispatch(setEventsList({ eventsList, categories }));
};

export const addPreset = ({ name }: IAddPresetParams) => async (dispatch, getState: () => IStore) => {
    const state = getState();
    const { id } = await addPresetService({
        ownerUserId: Number(state.user.profile.userId),
        name,
        eventTypes: state.eventFilters.eventTypes
    });

    dispatch(removeMutatedPreset({ id: state.eventFilters.selectedPresetId }));
    await dispatch(getPresets());
    dispatch(setSelectedPreset({ id }));
};

export const removePreset = () => async (dispatch, getState: () => IStore) => {
    const state = getState();
    const { selectedPresetId } = state.eventFilters;

    await removePresetService({ id: selectedPresetId })
    dispatch(unselectPreset());
    dispatch(getPresets());
};

export const getPresets = () => (dispatch, getState: () => IStore): Promise<void> => {
    const state = getState();
    const { userId } = state.user.profile;

    return getPresetsService({ userId: Number(userId) })
        .then(({ presets }) => {
            dispatch(setPresets({ presets }));
        });
};

export const savePreset = () => async (dispatch, getState: () => IStore) => {
    const state = getState();
    const { selectedPresetId, eventTypes } = state.eventFilters;
    const preset = find(state.eventFilters.presets, { id: selectedPresetId });

    await savePresetService({
        id: preset.id,
        ownerUserId: Number(state.user.profile.userId),
        name: preset.name,
        eventTypes
    });
    dispatch(removeMutatedPreset({ id: selectedPresetId }));
    dispatch(getPresets());
};
