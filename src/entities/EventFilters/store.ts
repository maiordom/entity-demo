export interface IEventFiltersItem {
    isActive: boolean;
    name: string;
    type: string;
}

export interface IEventFiltersCategories {
    [category: string]: Array<IEventFiltersItem>;
}

export interface IEventsList {
    [type: string]: IEventFiltersItem;
}

export interface IEventFiltersPreset {
    id: number;
    name: string;
    eventTypes: Array<string>;
}

export interface IEventFiltersMutatedPresets {
    [id: number]: IEventFiltersPreset;
}

export const NONE = -1;

export interface IEventFilters {
    categories: IEventFiltersCategories;
    eventsList: IEventsList;
    eventTypes: Array<string>;
    presets: Array<IEventFiltersPreset>;
    mutatedPresets: IEventFiltersMutatedPresets;
    selectedPresetId: number;
    mapTypeToName: {
        [type: string]: string;
    }
}

export const eventFilters: IEventFilters = {
    categories: {},
    eventsList: {},
    eventTypes: [],
    presets: [],
    mutatedPresets: {},
    selectedPresetId: NONE,
    mapTypeToName: {}
};
