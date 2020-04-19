import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from "./redux_store/reducers";
import { Provider } from 'react-redux';
//Since the Redux action -> reducer flow is synchronous, we will use Redux Thunk to make the flow asynchronous
//and make API calls from our action creators.
import thunk from 'redux-thunk';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './styling/index.scss';

//enable redux dev tools extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//createStore will take in a single reducer, the reducer represents the state (data) of our application globally. 
//We need to create a store variable, and use createStore to create the Redux store.
const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))    
);

ReactDOM.render(
    //Now that we have a store, we want to make our application aware of it. The way this works is that 
    //react-redux gives us a <Provider></Provider> component that wraps around our entire application. 
    //We will pass our newly created store to that component as a prop.
    <Provider store = {store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
