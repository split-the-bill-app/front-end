import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import DarkModeSwitch from './DarkModeSwitch.js';
import Search from './Search.js';

const AppHeader = (props) => {

  useEffect( () => {
    localStorage.getItem("token");
  }, []);

  return (
    <div className="appheader">      
      <h1>&#36;plit the Bill</h1>      

      <div className = "header-icons">
        <DarkModeSwitch/>          
        {/* {(localStorage.getItem("token")) && !props.loggedOut ? <Search/> : null } */}
      </div>
    </div>
  );
}     

const mapStateToProps = state => {
  return {
    loggedOut: state.usersReducerIndex.loggedOut
  }
}

export default connect(mapStateToProps)(AppHeader);
