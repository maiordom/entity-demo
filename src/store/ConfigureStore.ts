import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from 'src/rootReducer';
import loggerMiddleware from 'src/store/LoggerMiddleware';

import { IStore } from 'src/store';

const middleWares = [
    thunk,
    loggerMiddleware
];

export const configureStore = (initialState = {}) => {
    return createStore<IStore, any, {}, {}>(
        rootReducer,
        initialState,
        applyMiddleware(...middleWares)
    );
};
