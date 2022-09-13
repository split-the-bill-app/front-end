import React, { useEffect } from 'react';
import Navbar from './Navbar.jsx';
import Search from './Search.js';

const SplitProofHeader = () => {

  useEffect( () => {
    localStorage.getItem("token");

  }, [])

  return (
    <div className="splitproofheader">
      
      <h1>&#36;plit the Bill</h1>      

        <div className = "header-icons">
          <Navbar/>
          {/* {(localStorage.getItem("token")) ? <Search/> : null } */}
        </div>
    </div>
  );
}     

export default SplitProofHeader;