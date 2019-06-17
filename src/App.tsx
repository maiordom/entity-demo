import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';

import { configureStore } from 'src/store/ConfigureStore';
import { getInitialState, getCurrentState } from 'src/store';
import clientRoutes from 'src/routes/client';
import { matchToPath } from 'src/entities/Navigation/actions';

import IndexPage from 'src/pages/Index';
import TestPage from 'src/pages/Test';
import AuthPage from 'src/pages/Auth';

import { setStore, request, webshopTransport } from 'src/utils/Request';
import { bindEvents as bindRequestJournalEvents } from 'src/entities/RequestJournal/actions';
import { bindEvents as bindRequestErrorsEvents } from 'src/entities/RequestError/actions';
import { refreshToken } from 'src/entities/User/actions';

const currentState = getCurrentState();
const initialState = getInitialState();

[
    'user',
    'apps',
    'appsOptions',
    'imagesGroups',
    'site'
].forEach(propName => {
    const newProps = get(currentState, propName);

    if (newProps) {
        set(initialState, propName, newProps);
    }
});

if (get(currentState, 'area.selected')) {
    const { id } = currentState.area.selected;

    const selectedArea = find(initialState.area.items, { id });

    if (selectedArea) {
        initialState.area.selected = selectedArea;
    }
}

initialState.about.tag = __TAG__;

const store = configureStore(initialState);
const area = initialState.area.selected.id;

request.init('admin', area);
webshopTransport.init('webshop', area);

setStore(store);
bindRequestJournalEvents(store.dispatch);
bindRequestErrorsEvents(store.dispatch);

store.dispatch(matchToPath({ path: location.pathname }));

class App extends React.PureComponent<any, any> {
    componentWillMount() {
        const { user: { token } } = store.getState();

        if (!token) {
            history.pushState(null, null, clientRoutes.auth);
        } else {
            this.refreshToken();
        }
    }

    refreshToken() {
        const { user: { token } } = store.getState();

        store.dispatch(refreshToken({ refresh_token: token.refreshToken }));
    }

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div className="router">
                        <Switch>
                            <Route exact path={clientRoutes.auth} component={AuthPage} />
                            <Route path={clientRoutes.general} component={IndexPage} />
                            <Route path={clientRoutes.test} component={TestPage} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default hot(module)(App);
