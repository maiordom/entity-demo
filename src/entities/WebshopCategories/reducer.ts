import { handleActions } from 'redux-actions';
import find from 'lodash/find';

import * as a from './actions';
import { IStore } from 'src/store';

import { IWebshopCategory } from './store';

import {
    ISetWebshopCategoriesAction,
    IChangeWebshopCategoryAction
} from './actions';

const actions = {
    [a.changeWebshopCategory.name]: (state: IStore, { payload: { category, parentCategoryId } }: IChangeWebshopCategoryAction) => {
        const rawCategory = find(state.webshopCategories[category.serviceId].raw, { id: category.id });

        rawCategory.parentCategoryId = parentCategoryId;

        (actions[a.setWebshopCategories.name] as any)(state, { payload: {
            serviceId: category.serviceId,
            categories: state.webshopCategories[category.serviceId].raw
        }});

        return state;
    },

    [a.setWebshopCategories.name]: (state: IStore, { payload: { serviceId, categories } }: ISetWebshopCategoriesAction) => {
        const categoriesMap: { [key: number]: IWebshopCategory; } = {};
        const parentCategoriesMap: { [key: number]: { [categoryId: number]: IWebshopCategory; } } = {};
        const categoriesTree: { [key: number]: IWebshopCategory; } = {};

        categories.forEach(item => {
            categoriesMap[item.id] = Object.assign({ childrens: [] }, item);

            if (!parentCategoriesMap[item.parentCategoryId]) {
                parentCategoriesMap[item.parentCategoryId] = {};
            }

            parentCategoriesMap[item.parentCategoryId][item.id] = categoriesMap[item.id];
        });

        for (let key in parentCategoriesMap) {
            if (key in categoriesMap) {
                categoriesMap[key].childrens = Object.keys(parentCategoriesMap[key]).map(categoryId => 
                    parentCategoriesMap[key][categoryId]
                );
                delete parentCategoriesMap[key];
            }
        }

        for (let key in parentCategoriesMap) {
            if (key in categoriesMap) {
                categoriesTree[key] = categoriesMap[key];
            } else {
                Object.keys(parentCategoriesMap[key]).forEach(key => {
                    categoriesTree[key] = categoriesMap[key];
                });
            }
        }

        state.webshopCategories[serviceId] = {
            tree: categoriesTree,
            map: categoriesMap,
            raw: categories
        };

        return state;
    }
};

export default handleActions(actions, {});
