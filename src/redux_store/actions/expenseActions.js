import { axiosWithAuth } from '../../utils/axiosWithAuth.js';

export const ADD_EXPENSE_START = 'ADD_EXPENSE_START';
export const ADD_EXPENSE_SUCCESS = 'ADD_EXPENSE_SUCCESS';
export const ADD_EXPENSE_FAILURE = 'ADD_EXPENSE_FAILURE';
export const GET_EXPENSE_TO_EDIT_START = 'GET_EXPENSE_TO_EDIT_START';
export const GET_EXPENSE_TO_EDIT_SUCCESS = 'GET_EXPENSE_TO_EDIT_SUCCESS';
export const GET_EXPENSE_TO_EDIT_FAILURE = 'GET_EXPENSE_TO_EDIT_FAILURE';
export const EDIT_EXPENSE_START = 'EDIT_EXPENSE_START';
export const EDIT_EXPENSE_SUCCESS = 'EDIT_EXPENSE_SUCCESS';
export const EDIT_EXPENSE_FAILURE = 'EDIT_EXPENSE_FAILURE';
export const DELETE_EXPENSE_START = 'DELETE_EXPENSE_START';
export const DELETE_EXPENSE_SUCCESS = 'DELETE_EXPENSE_SUCCESS';
export const DELETE_EXPENSE_FAILURE = 'DELETE_EXPENSE_FAILURE';
export const GET_ALL_USER_EXPENSES_START = 'GET_ALL_USER_EXPENSES_START';
export const GET_ALL_USER_EXPENSES_SUCCESS = 'GET_ALL_USER_EXPENSES_SUCCESS';
export const GET_ALL_USER_EXPENSES_FAILURE = 'GET_ALL_USER_EXPENSES_FAILURE';

export const addNewExpense = newExpenseInfo => dispatch => {

    dispatch({ type: ADD_EXPENSE_START });
    //axiosWithAuth().post('http://localhost:5000/api/bills/', newExpenseInfo)
    axiosWithAuth().post('https://split-the-bill-app-main.herokuapp.com/api/bills/', newExpenseInfo)
    .then(res => { 
        console.log("add expense data returned from server in actions", res.data)            
        dispatch({ type: ADD_EXPENSE_SUCCESS, payload: res.data })        
    })    
    .catch(err => {
        dispatch({ type: ADD_EXPENSE_FAILURE, error: err })
    })

}//end addNewExpense

export const getExpenseToEdit = (expenseId) => dispatch => {
    dispatch({ type: GET_EXPENSE_TO_EDIT_START })
    //axiosWithAuth().get(`http://localhost:5000/api/bills/${expenseId}`)
    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/bills/${expenseId}`)
    .then(res => {
        console.log("get expense to edit in actions", res.data);
        dispatch({ type: GET_EXPENSE_TO_EDIT_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: GET_EXPENSE_TO_EDIT_FAILURE, error: err})
    })

}//end getExpenseToEdit

export const editExistingExpense = (editExpenseInfo, expenseId) => dispatch => {
    dispatch({ type: EDIT_EXPENSE_START})
    //axiosWithAuth().put(`http://localhost:5000/api/bills/${expenseId}`, editExpenseInfo)
    axiosWithAuth().put(`https://split-the-bill-app-main.herokuapp.com/api/bills/${expenseId}`, editExpenseInfo)
    .then(res => {
        console.log("edit expense data in actions", res.data)
        dispatch({ type: EDIT_EXPENSE_SUCCESS, payload: res.data})
    })
    .catch(err => {
        dispatch({ type: EDIT_EXPENSE_FAILURE, error: err })
    })

}//end editExpense

export const deleteExpense = (expenseId) => dispatch => {
    dispatch({ type: DELETE_EXPENSE_START })
    //axiosWithAuth().delete(`http://localhost:5000/api/bills/${expenseId}`)
    axiosWithAuth().delete(`https://split-the-bill-app-main.herokuapp.com/api/bills/${expenseId}`)
    .then(res => {
        console.log("delete expense data in actions", res.data)
        dispatch({ type: DELETE_EXPENSE_SUCCESS, payload: res.data})
    })
    .catch(err => {
        dispatch({ type: DELETE_EXPENSE_FAILURE, error: err})
    })

}//end deleteExpense

export const getAllExpenses = userId => dispatch => {
    dispatch({ type: GET_ALL_USER_EXPENSES_START })
    //axiosWithAuth().get(`http://localhost:5000/api/users/${userId}/bills`)
    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/users/${userId}/bills`)
    .then(res => {
        console.log("get all user expenses data in actions", res.data)
        dispatch({ type: GET_ALL_USER_EXPENSES_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: GET_ALL_USER_EXPENSES_FAILURE, error: err })
    })

}//end getAllExpenses


