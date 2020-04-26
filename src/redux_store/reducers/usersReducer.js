import {
REGISTER_USER_START,
REGISTER_USER_SUCCESS,
REGISTER_USER_FAILURE,
LOGIN_USER_START,
LOGIN_USER_SUCCESS,
LOGIN_USER_FAILURE,
LOGOUT_USER_SUCCESS,
GET_USER_DETAILS_START,
GET_USER_DETAILS_SUCCESS,
GET_USER_DETAILS_FAILURE
} from '../actions';

const initialState = {
    registerError: null,    
    isRegistering: false,
    registered: false,
    loginError: null,
    isLoggingIn: false,
    loggedIn: false,
    userId: null,
    token: null,
    loggedOut: false,
    user: {
        id: "",
        email: "",
        firstname: "",
        lastname: ""
    }
}

export const usersReducer = (state = initialState, action) => {

    switch(action.type){

        case REGISTER_USER_START:
            return {
                ...state,
                isRegistering: true,
                registerError: null,
            };
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                isRegistering: false,                
                registerError: null,
                user: action.payload,
                userId: action.payload.id,
                registered: true             
            };
        case REGISTER_USER_FAILURE:
            return {
                ...state,
                registerError: action.error,
                isRegistering: false
            };
        case LOGIN_USER_START:
            return {
                ...state,
                isLoggingIn: true,
                loginError: null
            };
        case LOGIN_USER_SUCCESS:            
            return{
                ...state,
                loggedOut: false,
                isLoggingIn: false,                
                user: action.payload.user,
                userId: action.payload.user.id,
                token: action.payload.token,
                loggedIn: true                
            };
        case LOGIN_USER_FAILURE:
            return {
                ...state,
                loginError: action.error,
                isLoggingIn: false
            };
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                loggedIn: false,
                userId: null,
                token: null,
                loggedOut: true
            };       
        default:
            return state;

    }//end switch

};//end usersReducer