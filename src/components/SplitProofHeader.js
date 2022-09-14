import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Navbar from './Navbar.jsx';
import Search from './Search.js';

const SplitProofHeader = (props) => {

  useEffect( () => {
    localStorage.getItem("token");

  }, [])

  return (
    <div className="splitproofheader">
      
      <h1>&#36;plit the Bill</h1>      

        <div className = "header-icons">
          <Navbar/>          
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

export default connect(mapStateToProps)(SplitProofHeader);
//export default SplitProofHeader;