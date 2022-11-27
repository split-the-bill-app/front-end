import axios from 'axios';
import { axiosWithAuth } from '../../utils/axiosWithAuth.js';

export const REGISTER_USER_START = 'REGISTER_USER_START';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
export const LOGIN_USER_START = 'LOGIN_USER_START';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';
export const GET_USER_DETAILS_START = 'GET_USER_DETAILS_START';
export const GET_USER_DETAILS_SUCCESS = 'GET_USER_DETAILS_SUCCESS';
export const GET_USER_DETAILS_FAILURE = 'GET_USER_DETAILS_FAILURE';

export const registerUser = newUserInfo => dispatch => {
    let registerError = false;

    dispatch({ type: REGISTER_USER_START });

    //axios.post('http://localhost:5000/api/users/register', newUserInfo)
    axios.post('https://split-the-bill-app-main.herokuapp.com/api/users/register', newUserInfo)
    .then(res => {                   
        dispatch({ type: REGISTER_USER_SUCCESS, payload: res.data })        
    }) 
    .catch(err => {      
        let errorMsg = '';
        if(err && err.response && err.response.data && err.response.data.errorMsg){
            errorMsg = err.response.data.errorMsg;
        }else{
            errorMsg = 'A server error occurred during sign up.';
        }
        
        dispatch({ type: REGISTER_USER_FAILURE, error: errorMsg })    
        registerError = true;    
    })    
    //automatically logs the user in after registration
    .then(() => {  
        if(registerError){
            return;
        }

        dispatch ({ type: LOGIN_USER_START });

        //axios.post('http://localhost:5000/api/users/login', {email: newUserInfo.email, password: newUserInfo.password})
        axios.post('https://split-the-bill-app-main.herokuapp.com/api/users/login', {email: newUserInfo.email, password: newUserInfo.password})
        .then(res => {           
            dispatch({ type: LOGIN_USER_SUCCESS, payload: res.data})            
        })
    })
    .catch(err => {       
        let errorMsg = '';
        if(err && err.response && err.response.data && err.response.data.errorMsg){
            errorMsg = err.response.data.errorMsg;
        }else{
            errorMsg = 'A server error occurred during sign in.';
        }

        dispatch({ type: LOGIN_USER_FAILURE, error: errorMsg })
    })    

}//end registerUser

export const loginUser = loginCredentials => dispatch => {
    dispatch({ type: LOGIN_USER_START });

    //axios.post('http://localhost:5000/api/users/login', loginCredentials)
    axios.post('https://split-the-bill-app-main.herokuapp.com/api/users/login', loginCredentials)
    .then(res => {       
        dispatch({ type: LOGIN_USER_SUCCESS, payload: res.data })         
    })
    .catch(err => {        
        let errorMsg = '';

        if(err && err.response && err.response.data && err.response.data.errorMsg){
            errorMsg = err.response.data.errorMsg;
        }else{
            errorMsg = 'A server error occurred during sign in.';
        }

        dispatch({ type: LOGIN_USER_FAILURE, error: errorMsg })
    })
    
}//end loginUser

export const logoutUser = () => dispatch => {   
    dispatch({ type: LOGOUT_USER_SUCCESS });
}

export const getUserDetails = userId => dispatch => {
    dispatch({ type: GET_USER_DETAILS_START });

    //axiosWithAuth().get(`http://localhost:5000/api/users/${userId}`)
    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/users/${userId}`)
    .then(res => {       
        dispatch({ type: GET_USER_DETAILS_SUCCESS, payload: res.data });
    })
    .catch(err => {
        dispatch({ type: GET_USER_DETAILS_FAILURE, error: err });
    })

}//end getUserDetails



