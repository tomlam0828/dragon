import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { render } from 'react-dom';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import './index.css';
import Root from './components/Root';
import { fetchAuthenticated } from './actions/account';

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )

);

store.dispatch(fetchAuthenticated())
    .then(() => {
        render(
            <Provider store={store}>
                <Root />
            </Provider>
            , document.getElementById('root')
        );
    });
