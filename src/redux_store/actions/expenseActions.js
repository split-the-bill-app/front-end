import axios from 'axios';
import { axiosWithAuth } from '../../utils/axiosWithAuth.js';

export const ADD_EXPENSE_START = 'ADD_EXPENSE_START';
export const ADD_EXPENSE_SUCCESS = 'ADD_EXPENSE_SUCCESS';
export const ADD_EXPENSE_FAILURE = 'ADD_EXPENSE_FAILURE';
export const EDIT_EXPENSE_START = 'EDIT_EXPENSE_START';
export const EDIT_EXPENSE_SUCCESS = 'EDIT_EXPENSE_SUCCESS';
export const EDIT_EXPENSE_FAILURE = 'EDIT_EXPENSE_FAILURE';
export const DELETE_EXPENSE_START = 'DELETE_EXPENSE_START';
export const DELETE_EXPENSE_SUCCESS = 'DELETE_EXPENSE_SUCCESS';
export const DELETE_EXPENSE_FAILURE = 'DELETE_EXPENSE_FAILURE';
export const GET_ALL_USER_EXPENSES_START = 'GET_ALL_USER_EXPENSES_START';
export const GET_ALL_USER_EXPENSES_SUCCESS = 'GET_ALL_USER_EXPENSES_SUCCESS';
export const GET_ALL_USER_EXPENSES_FAILURE = 'GET_ALL_USER_EXPENSES_FAILURE';

export const addExpense = newExpenseInfo => dispatch => {

    dispatch({ type: ADD_EXPENSE_START });
    axiosWithAuth.post('https://split-the-bill-app.herokuapp.com/api/bills/', newExpenseInfo)
    .then(res => { 
        console.log("add expense data in actions", res.data)            
        dispatch({ type: ADD_EXPENSE_SUCCESS, payload: res.data })        
    })    
    .catch(err => {
        dispatch({ type: ADD_EXPENSE_FAILURE, error: err })
    })

}//end addExpense

export const editExpense = (editExpenseInfo, expenseId) => dispatch => {
    dispatch({ type: EDIT_EXPENSE_START})
    axiosWithAuth().put('https://split-the-bill-app.herokuapp.com/api/bills/${expenseId}', editExpenseInfo)
    .then(res => {
        console.log("edit expense data in actions", res.data)
        dispatch({ type: EDIT_EXPENSE_SUCCESS, payload: res.data})
    })
    .catch(err => {
        dispatch({ type: ADD_EXPENSE_FAILURE, error: err })
    })

}//end editExpense

export const deleteExpense = () => dispatch => {
    dispatch({ type: DELETE_EXPENSE_START })
    axiosWithAuth().delete()
    .then(res => {
        console.log("delete expense data in actions", res.data)
        dispatch({ type:  DELETE_EXPENSE_SUCCESS, payload: res.data})
    })
    .catch(err => {
        dispatch({ type: DELETE_EXPENSE_FAILURE, error: err})
    })

}//end deleteExpense

export const getAllExpenses = userId => dispatch => {
    dispatch({ type: GET_ALL_USER_EXPENSES_START })
    axiosWithAuth().get('https://split-the-bill-app.herokuapp.com/api/users/${userId}/bills')
    .then(res => {
        console.log("get all user expenses data in actions", res.data)
        dispatch({ type: GET_ALL_USER_EXPENSES_SUCCESS, action: res.data })
    })
    .catch(err => {
        dispatch({ type: GET_ALL_USER_EXPENSES_FAILURE, error: err })
    })

}//end getAllExpenses


