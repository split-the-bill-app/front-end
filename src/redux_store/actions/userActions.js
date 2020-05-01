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
    dispatch({ type: REGISTER_USER_START });
    axios.post('https://split-the-bill-app.herokuapp.com/api/users/register', newUserInfo)
    .then(res => { 
        console.log("register data in actions", res)            
        dispatch({ type: REGISTER_USER_SUCCESS, payload: res.data })        
    })
    .catch(err => {
        dispatch({ type: REGISTER_USER_FAILURE, error: err })
    })    
    //automatically logs the user in after registration
    .then(() => {
        dispatch ({ type: LOGIN_USER_START });
        axios.post('https://split-the-bill-app.herokuapp.com/api/users/login', {email: newUserInfo.email, password: newUserInfo.password})
        .then(res => {            
            console.log("login register data in actions", res.data)
            dispatch({ type: LOGIN_USER_SUCCESS, payload: res.data})            
        })
    })
    .catch(err => {
        dispatch({ type: LOGIN_USER_FAILURE, error: err })
    })    

}//end registerUser

export const loginUser = loginCredentials => dispatch => {

    dispatch({ type: LOGIN_USER_START });
    axios.post('https://split-the-bill-app.herokuapp.com/api/users/login', loginCredentials)
    .then(res => {        
        console.log("login data in actions", res.data) 
        dispatch({ type: LOGIN_USER_SUCCESS, payload: res.data })         
    })
    .catch(err => {
        dispatch({ type: LOGIN_USER_FAILURE, error: err })
    })
}//end loginUser

export const logoutUser = () => dispatch => {   
    dispatch({ type: LOGOUT_USER_SUCCESS });
}

export const getUserDetails = userId => dispatch => {
    dispatch({ type: GET_USER_DETAILS_START });

    axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/users/${userId}`)
    .then(res => {
        console.log("user details in actions", res.data);
        dispatch({ type: GET_USER_DETAILS_SUCCESS, payload: res.data });
    })
    .catch(err => {
        dispatch({ type: GET_USER_DETAILS_FAILURE, error: err });
    })
}//end getUserDetails



