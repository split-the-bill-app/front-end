import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser, loginUser } from '../redux_store/actions';

const RegisterScreen = (props) => {  
  const [newUserInfo, setNewUserInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  })

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

  }, [props.userId, props.token, props.loggedIn])

  const handleChange = (e) => {   
    e.preventDefault(); 
    setNewUserInfo({
      ...newUserInfo,
      [e.target.name]: e.target.value
    })    
  };
  
  const handleSubmit = (e) => {   
    e.preventDefault();
    props.registerUser(newUserInfo);     
  }

  return (
    <div className="register-screen">
      <div className="register-form-container">

      <h2 className="register-form-title">Sign Up to Start $plitting</h2>

        <form onSubmit={handleSubmit} className="register-form">          
            <input 
              onChange={handleChange}
              name="firstname"                                    
              placeholder="First Name"
              type="text"
              required
            />

            <input 
              onChange={handleChange}
              name="lastname"
              placeholder="Last Name"
              type="text"
              required
            />    

            <input 
              onChange={handleChange}
              name="email"
              placeholder="Desired Email"
              type="email"
              required
            />

            <input 
              onChange={handleChange}
              name="password"
              placeholder="Desired Password"
              type="password"
              required
            />

          {props.registerError &&
            <div style={{ backgroundColor: 'transparent' }} className="login-description">
              <p style={{ color: 'red' }}> {props.registerError} </p>
            </div>
          }
         
          <button> {props.isRegistering ? "Signing Up..." : "Sign Up"} </button>
        </form>

        <div className="login-description">
          <p>Already have an account? Login <Link to='/'>Here</Link></p>
        </div>

      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    isRegistering: state.usersReducerIndex.isRegistering,
    registered: state.usersReducerIndex.registered,
    registerError: state.usersReducerIndex.registerError,    
    isLoggingIn: state.usersReducerIndex.isLoggingIn,
    loggedIn: state.usersReducerIndex.loggedIn,
    loginError: state.usersReducerIndex.loginError,
    userId: state.usersReducerIndex.userId,
    token: state.usersReducerIndex.token,
    user: state.usersReducerIndex.user
  }
}

export default connect(mapStateToProps, { registerUser, loginUser })(RegisterScreen);