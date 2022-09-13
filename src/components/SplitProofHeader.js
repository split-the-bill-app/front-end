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

      {/* {(localStorage.getItem("token")) ?  */}

        <div className = "header-icons">
          <Navbar/>
          {/* <Search/> */}
        </div>
      {/* :
      null
    } */}
  </div>
  );
}

export default SplitProofHeader;