import {
    ADD_EXPENSE_START,
    ADD_EXPENSE_SUCCESS,
    ADD_EXPENSE_FAILURE,
    EDIT_EXPENSE_START,
    EDIT_EXPENSE_SUCCESS,
    EDIT_EXPENSE_FAILURE,
    DELETE_EXPENSE_START,
    DELETE_EXPENSE_SUCCESS,
    DELETE_EXPENSE_FAILURE,
    GET_ALL_USER_EXPENSES_START,
    GET_ALL_USER_EXPENSES_SUCCESS,
    GET_ALL_USER_EXPENSES_FAILURE
}from '../actions';

const initialState = {
    addExpenseError: null,
    isAddingExpense: false,
    addedExpenseSuccess: false,
    expense: {},
    editExpenseError: null,
    isEditingExpense: false,
    editExpenseSuccess: false,
    editExpenseConfirmation: "", //server returns a success message
    deleteExpenseError: null,
    isDeletingExpense: false,
    deleteExpenseSuccess: false,
    deleteExpenseConfirmation: "", //server returns a message
    getAllExpensesError: null,
    isGettingAllExpenses: false,
    allExpenses: [],
    getAllExpensesSuccess: false
    
}
    
export const expensesReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_EXPENSE_START:
            return{
                ...state,
                isAddingExpense: true,
                addExpenseError: null, //for cases where we are transitioning from an error state
            };
        case ADD_EXPENSE_SUCCESS:
            return{
                ...state,
                isAddingExpense: false,
                expense: action.payload,                
                addedExpenseSuccess: true,
                addExpenseError: null
            };
        case ADD_EXPENSE_FAILURE:
            return{
                ...state,
                addExpenseError: action.error,
                isAddingExpense: false
            };
        case EDIT_EXPENSE_START:
            return{
                ...state,
                isEditingExpense: true,
                editExpenseError: null, //for cases where we are transitioning from an error state
            };
        case EDIT_EXPENSE_SUCCESS:
            return{
                ...state,
                isEditingExpense: true,
                editExpenseConfirmation: action.payload,
                editExpenseSuccess: true,
                editExpenseError: null
            };
        case EDIT_EXPENSE_FAILURE:
            return{
                ...state,
                editExpenseError: action.error,
                isEditingExpense: false
            };
        case DELETE_EXPENSE_START:
            return{
                ...state,
                deleteExpenseError: null,
                isDeletingExpense: true               
            };
        case DELETE_EXPENSE_SUCCESS:
            return{
                ...state,
                deleteExpenseError: null,
                isDeletingExpense: false,
                deleteExpenseSuccess: true,
                deleteExpenseConfirmation: action.payload
            };
        case DELETE_EXPENSE_FAILURE:
            return{
                ...state,
                deleteExpenseError: action.error,
                isDeletingExpense: false                 
            };
        case GET_ALL_USER_EXPENSES_START:
            return{
                ...state,
                isGettingAllExpenses: true,
                getAllExpensesError: false
            };
        case GET_ALL_USER_EXPENSES_SUCCESS:
            return{
                ...state,
                isGettingAllExpenses: false,
                allExpenses: action.payload,
                getAllExpensesSuccess: true,
                getAllExpensesError: null  
            };
        case GET_ALL_USER_EXPENSES_FAILURE:
            return{
                isGettingAllExpenses: false,
                getAllExpensesError: action.error
            }
        default:
            return state;       

    }//end switch

}//end expensesReducer