import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { render } from 'react-dom';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import './index.css';
import history from "./history";
import Root from './components/Root';
import AccountDragons from './components/AccountDragons';
import { fetchAuthenticated } from './actions/account';
import PublicDragons from './components/publicDragons';

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

const AuthRoute = props => {
    if (!store.getState().account.loggedIn) {
        return <Redirect to={{ pathname: '/' }} />
    }

    const { component, path } = props;

    return <Route path={path} component={component} />
}

store.dispatch(fetchAuthenticated())
    .then(() => {
        render(
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        <Route exact path='/' component={Root} />
                        <AuthRoute path='/account-dragons' component={AccountDragons} />
                    </Switch>
                </Router>
            </Provider>
            , document.getElementById('root')
        );
    });
