import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from "./redux_store/reducers";
import { Provider } from 'react-redux';
//The Redux action -> reducer flow is synchronous, use Redux Thunk to make the flow asynchronous and make API calls from action creators.
import thunk from 'redux-thunk';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './styling/index.scss';

//enable redux dev tools extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))    
);

ReactDOM.render(    
    <Provider store = {store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
