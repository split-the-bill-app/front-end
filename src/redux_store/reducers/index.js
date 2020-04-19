import { combineReducers } from 'redux';
import { usersReducer } from './usersReducer.js';
import { expensesReducer } from './expensesReducer.js';
import { notificationsReducer } from './notificationsReducer.js';

const rootReducer = combineReducers({
    users: usersReducer,
    expenses: expensesReducer,
    notifications: notificationsReducer

});

export default rootReducer;
