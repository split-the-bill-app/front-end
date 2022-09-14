import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "../redux_store/actions";

const LoginSignupScreen = (props) => {
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: ""
  });

  //useEffect that checks for updated state from the redux store and update userId & token accordingly
  useEffect(() => {

    if(props.user){
      localStorage.setItem('userEmail', props.user.email);
    }

    if(props.userId){      
      localStorage.setItem('userId', props.userId);
    }

    if(props.token){      
      localStorage.setItem('token', props.token);
    }

    if(props.loggedIn){      
      props.history.push('/dashboard')
    }

  }, [props.user, props.userId, props.token, props.loggedIn])
  
  const handleChange = (e) => {
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value
    })
   
  }

  const handleSubmit = (e) => {   
    e.preventDefault();   
    props.loginUser(loginCredentials);        
  }

  return (
    <div className="login-screen">

      <div className="login-form-container">

        <h2 className="login-form-title">Sign In to Start $plitting</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input 
          onChange={handleChange}
          className="input-email"
          name="email"
          type="email"
          placeholder="Email"
          required
          />
          <input 
          onChange={handleChange}
          className="input-password"
          name="password"
          type="password"
          placeholder="Password"
          required
          />

          {props.loginError &&
            <div className="register-description">
              <p style={{ color: 'red' }}> {props.loginError} </p>
            </div>
          }

          <button> {props.isLoggingIn ? "Signing In..." : "Sign In"} </button>
        </form>       

        <div className="register-description">
          <p>Don't have an account? Sign Up <Link to='/register'>Here</Link></p>
        </div>
        
      </div>
    </div>
  );
}

const mapStateToProps = state => {  
  return {     
    isLoggingIn: state.usersReducerIndex.isLoggingIn,
    loggedIn: state.usersReducerIndex.loggedIn,
    loginError: state.usersReducerIndex.loginError,
    userId: state.usersReducerIndex.userId,
    token: state.usersReducerIndex.token,
    user: state.usersReducerIndex.user
  }
}

export default connect(mapStateToProps, { loginUser })(LoginSignupScreen);