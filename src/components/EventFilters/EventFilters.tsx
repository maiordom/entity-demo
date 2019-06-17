import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import find from 'lodash/find';

import Button from 'ui/lib/Button';
import Checkbox from 'ui/lib/Checkbox';
import Scroller from 'ui/lib/Scroller';
import Icon from 'ui/lib/Icon';
import InputCancel from 'ui/lib/InputCancel';
import Spinner from 'ui/lib/Spinner';

import {
    getEventsList,
    setFilterState,
    setFilterCategoryState,
    addPreset,
    getPresets,
    selectPreset,
    removePreset,
    savePreset,
    unselectPreset,
    ISetFilterStateParams,
    ISetFilterCategoryStateParams,
    ISelectPresetParams,
    IAddPresetParams
} from 'src/entities/EventFilters/actions';
import {
    IEventFiltersCategories,
    IEventFiltersItem,
    IEventsList,
    IEventFiltersPreset,
    IEventFiltersMutatedPresets,
    NONE
} from 'src/entities/EventFilters/store';
import { IStore } from 'src/store';

import RequestTracker, { IRequest } from 'src/components/RequestTracker/RequestTracker';
import api from 'src/routes/api';

import css from './EventFilters.css';

interface IPreset {
    id: number;
    name: string;
    eventTypes: Array<string>;
    isMutated: boolean;
}

interface IProps {
    categories: IEventFiltersCategories;
    eventsList: IEventsList;
    eventTypes: Array<string>;
    presets: Array<IPreset>;
    selectedPresetId: number;
    loaders?: {
        addPreset: IRequest;
        savePreset: IRequest;
        removePreset: IRequest;
    };
}

interface IActions {
    actions: {
        getEventsList: () => Promise<any>;
        setFilterState: (params: ISetFilterStateParams) => void;
        setFilterCategoryState: (params: ISetFilterCategoryStateParams) => void;
        addPreset: (params: IAddPresetParams) => void;
        getPresets: () => void;
        selectPreset: (params: ISelectPresetParams) => void;
        unselectPreset: () => void;
        removePreset: () => void;
        savePreset: () => void;
    }
}

interface IState {
    isOpen: boolean;
    selectedCategory: string;
    search: string;
}

const MAP_CATEGORY_TO_NAME = {
    Money: 'Деньги',
    Profile: 'Профиль'
};

class EventFilters extends React.PureComponent<IProps & IActions, IState> {
    state: IState = {
        isOpen: false,
        selectedCategory: '',
        search: ''
    };

    refFilters: React.RefObject<HTMLDivElement> = React.createRef();

    onCategoryOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { category } = event.currentTarget.dataset;

        this.setState({ selectedCategory: category });
    };

    onCategoryClick = (checked: boolean, event) => {
        this.props.actions.setFilterCategoryState({
            category: event.currentTarget.name,
            isActive: checked
        });
    };

    onEventClick = (checked: boolean, event) => {
        this.props.actions.setFilterState({
            type: event.currentTarget.name,
            isActive: checked
        });
    };

    componentDidMount() {
        this.props.actions.getEventsList();
        this.props.actions.getPresets();
        this.bindEvents();
    }

    componentWillUnmount() {
        this.unbindEvents();
    }

    bindEvents() {
        document.body.addEventListener('click', this.onBodyClick);
        document.body.addEventListener('keydown', this.onBodyKeydown);
    }

    unbindEvents() {
        document.body.removeEventListener('click', this.onBodyClick);
        document.body.removeEventListener('keydown', this.onBodyKeydown);
    }

    onBodyClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const targetIsContainerOrChild = 
            target === this.refFilters.current || this.refFilters.current.contains(target);

        if (!targetIsContainerOrChild && this.state.isOpen) {
            this.setState({ isOpen: false });
        }
    };

    onBodyKeydown = (event: KeyboardEvent) => {
        if (this.state.isOpen && event.keyCode === 27) {
            this.setState({ isOpen: false });
        }
    };

    componentWillReceiveProps(nextProps: IProps & IActions) {
        const categoties = Object.keys(nextProps.categories);

        if (!this.state.selectedCategory.length && categoties.length) {
            this.setState({ selectedCategory: categoties[0] });
        }
    }

    onToggleClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    onSearchChange = (search: string) => {
        const categories = Object.keys(this.props.categories);
        
        this.setState({ search });

        if (search.length) {
            this.setState({ selectedCategory: '' });
        } else if (categories.length) {
            this.setState({ selectedCategory: categories[0] });
        }
    };

    onSearchCancel = () => {
        const categories = Object.keys(this.props.categories);

        this.setState({ search: '' });

        if (categories.length) {
            this.setState({ selectedCategory: categories[0] });
        }
    };

    onSelectPresetClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { selectedPresetId } = this.props;
        const id = Number(event.currentTarget.dataset.id);

        if (id === selectedPresetId) {
            this.props.actions.unselectPreset();
        } else {
            this.props.actions.selectPreset({ id });
        }
    };

    isSelectedPresetMutated = (): boolean => {
        const { selectedPresetId, presets } = this.props;
        const preset: IPreset = find(presets, { id: selectedPresetId });

        if (selectedPresetId !== NONE) {
            return preset.isMutated;
        }

        return false;
    };

    onPresetsClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.currentTarget === event.target) {
            this.props.actions.unselectPreset();
        }
    };

    onAddPresetClick = () => {
        let name;

        if (name = prompt('Введи название пресета')) {
            this.props.actions.addPreset({ name });
        }
    };
    
    onRemovePresetClick = () => {
        if (confirm('Удалить пресет?')) {
            this.props.actions.removePreset();
        }
    };

    render() {
        const { categories, eventTypes, presets, loaders, selectedPresetId } = this.props;
        const { selectedCategory, isOpen, search } = this.state;

        return (
            <div className={css.container} ref={this.refFilters}>
                <Button
                    theme="thin-black"
                    mods={['size-small', 'font-size-small']}
                    onClick={this.onToggleClick}
                >
                    Типы события{eventTypes.length > 0 && (
                        <span>&nbsp;({eventTypes.length})</span>
                    )}
                </Button>
                <div className={classNames(
                    css.filters,
                    isOpen && css.show
                )}>
                    <div className={classNames(css.column, css.left)}>
                        <div className={css.search}>
                            <InputCancel
                                onChange={this.onSearchChange}
                                onCancel={this.onSearchCancel}
                                value={search}
                                theme="light"
                                placeholder="Поиск типа события"
                            />
                        </div>
                        <div className="mt-s">
                            {Object.keys(categories).map(this.renderCategory)}
                        </div>
                        <div className={classNames(css.presets, 'mt-s', 'pt-s')} onClick={this.onPresetsClick}>
                            {presets.length > 0 && (
                                <Scroller
                                    mods={['vertical']}
                                    theme="light"
                                    className={css.presetsContainer}
                                    scrollAreaClassName={css.scrollArea}
                                >
                                    {presets.map(this.renderPreset)}
                                </Scroller>
                            )}
                            <div className={css.controls}>
                            {this.isSelectedPresetMutated() && this.renderControl(
                                loaders.savePreset,
                                'Сохранить изменения',
                                this.props.actions.savePreset
                            )}
                            {eventTypes.length > 0 && this.renderControl(
                                loaders.addPreset,
                                'Новый пресет',
                                this.onAddPresetClick
                            )}
                            {selectedPresetId !== NONE && this.renderControl(
                                loaders.removePreset,
                                'Удалить',
                                this.onRemovePresetClick
                            )}
                            </div>
                        </div>
                    </div>
                    <Scroller
                        mods={['vertical']}
                        theme="light"
                        className={classNames(css.column, css.right)}
                        scrollAreaClassName={css.scrollArea}
                    >
                        <div className={css.scrollerInner}>
                            {search.length
                                ? this.renderSearchResults()
                                : selectedCategory.length && categories[selectedCategory].map(this.renderEventsListItem)
                            }
                        </div>
                    </Scroller>
                </div>
            </div>
        );
    }

    renderControl = (loader: IRequest, label: string, handler: () => void) => {
        return !loader ? (
            <Button
                onClick={handler}
                className={css.control}
                mods={['size-small', 'font-size-small']}
                theme={'thin-black'}
            >
                {label}
            </Button>
        ) : (
            <div className={css.spinner}>
                <Spinner size="small" />
            </div>
        );
    }

    renderSearchResults = () => {
        const { search } = this.state;
        const { eventsList } = this.props;
        const searchString = search.toLowerCase();
        
        return Object.keys(eventsList)
            .filter((type) =>
                eventsList[type].name.toLowerCase().includes(searchString) || 
                eventsList[type].type.toLowerCase().includes(searchString)
            )
            .map((type) => eventsList[type])
            .map(this.renderEventsListItem)
    }

    renderCategory = (category: string) => {
        const { selectedCategory } = this.state;
        const eventsList = this.props.categories[category];
        const label = MAP_CATEGORY_TO_NAME[category] || category;
        const checkedEvents = eventsList.filter((event) => event.isActive);

        return (
            <div className={classNames(
                css.category,
                selectedCategory === category && css.selected
            )} key={category}>
                <Checkbox
                    theme="light"
                    name={category}
                    onClick={this.onCategoryClick}
                    checked={checkedEvents.length === eventsList.length}
                    halfChecked={checkedEvents.length > 0}
                />
                <button
                    className={css.categoryButton}
                    type="button"
                    data-category={category}
                    onClick={this.onCategoryOpen}
                >
                    {label}
                    <Icon className={css.arrow} category="controls" name="navigation-arrow-right" />
                </button>
            </div>
        );
    };

    renderEventsListItem = (event: IEventFiltersItem, index: number) => {
        return (
            <div className={css.item} key={`${event.type}${index}`} title={event.type}>
                <Checkbox
                    checked={event.isActive}
                    label={event.name}
                    theme="light"
                    name={event.type}
                    onClick={this.onEventClick}
                />
            </div>
        );
    }

    renderPreset = (preset: IPreset) => {
        const { selectedPresetId } = this.props;

        return (
            <div key={preset.name} className={css.preset}>
                <button
                    type="button"
                    className={classNames(
                        css.presetButton,
                        selectedPresetId === preset.id && css.selected
                    )}
                    onClick={this.onSelectPresetClick}
                    data-id={preset.id}
                    title={preset.name}
                >
                    {preset.name}
                    {preset.isMutated && <span>*</span>}
                </button>
            </div>
        )
    }
}

const mergePresets = (
    presets: Array<IEventFiltersPreset>,
    mutatedPresets: IEventFiltersMutatedPresets
): Array<IPreset> =>
    presets.map((preset) => ({
        ...preset,
        isMutated: Boolean(mutatedPresets[preset.id])
    }));

const mapStateToProps = (state: IStore): IProps => ({
    categories: state.eventFilters.categories,
    eventsList: state.eventFilters.eventsList,
    eventTypes: state.eventFilters.eventTypes,
    presets: mergePresets(state.eventFilters.presets, state.eventFilters.mutatedPresets),
    selectedPresetId: state.eventFilters.selectedPresetId
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getEventsList,
        setFilterState,
        setFilterCategoryState,
        addPreset,
        getPresets,
        selectPreset,
        removePreset,
        savePreset,
        unselectPreset,
    }, dispatch)
});

const EventFiltersWithConnect = connect(mapStateToProps, mapDispatchToProps)(EventFilters);

export default () => (
    <RequestTracker loaders={[
        api.events.addPreset,
        api.events.savePreset,
        api.events.removePreset
    ]}>
        <EventFiltersWithConnect />
    </RequestTracker>
);
