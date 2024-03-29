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

    axiosWithAuth().post('https://split-the-bill-app-main.herokuapp.com/api/bills/', newExpenseInfo)
    .then(res => {                
        dispatch({ type: ADD_EXPENSE_SUCCESS, payload: res.data })        
    })    
    .catch(err => {
        dispatch({ type: ADD_EXPENSE_FAILURE, error: err })
    })

}

export const getExpenseToEdit = (expenseId) => dispatch => {
    dispatch({ type: GET_EXPENSE_TO_EDIT_START });

    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/bills/${expenseId}`)
    .then(res => {        
        dispatch({ type: GET_EXPENSE_TO_EDIT_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: GET_EXPENSE_TO_EDIT_FAILURE, error: err})
    })
}

export const editExistingExpense = (editExpenseInfo, expenseId) => dispatch => {
    dispatch({ type: EDIT_EXPENSE_START});

    axiosWithAuth().put(`https://split-the-bill-app-main.herokuapp.com/api/bills/${expenseId}`, editExpenseInfo)
    .then(res => {       
        dispatch({ type: EDIT_EXPENSE_SUCCESS, payload: res.data})
    })
    .catch(err => {
        dispatch({ type: EDIT_EXPENSE_FAILURE, error: err })
    })
}

export const deleteExpense = (expenseId) => dispatch => {
    dispatch({ type: DELETE_EXPENSE_START });

    axiosWithAuth().delete(`https://split-the-bill-app-main.herokuapp.com/api/bills/${expenseId}`)
    .then(res => {       
        dispatch({ type: DELETE_EXPENSE_SUCCESS, payload: res.data})
    })
    .catch(err => {
        dispatch({ type: DELETE_EXPENSE_FAILURE, error: err})
    })
}

export const getAllExpenses = userId => dispatch => {
    dispatch({ type: GET_ALL_USER_EXPENSES_START });
       
    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/users/${userId}/bills`)
    .then(res => {   
        dispatch({ type: GET_ALL_USER_EXPENSES_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: GET_ALL_USER_EXPENSES_FAILURE, error: err })
    })
}


