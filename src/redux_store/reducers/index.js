import { combineReducers } from 'redux';
import { usersReducer } from './usersReducer.js';
import { expensesReducer } from './expensesReducer.js';
import { notificationsReducer } from './notificationsReducer.js';

const rootReducer = combineReducers({
    usersReducerIndex: usersReducer,
    expensesReducerIndex: expensesReducer,
    notificationsReducerIndex: notificationsReducer

});

export default rootReducer;
