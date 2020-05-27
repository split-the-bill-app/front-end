import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginSignUpScreen from './components/LoginSignUpScreen';
import PrivateRoute from './components/PrivateRoute';
import SplitProofHeader from './components/SplitProofHeader';
import RegisterScreen from './components/RegisterScreen';
import Dashboard from "./components/Dashboard.js";
import Navbar from "./components/Navbar";

function App() {

  
  return (
    // app (root component) wrapped in a router component, starts by default with login page
    // will route users to dashboard once signed in or registered
    <Router>
      <div className="App">
        <SplitProofHeader />
        <Navbar/>
        
        {/*Switch: if a route matches multiple routes enclosed in a switch statement, the browser will only 
        render the first component it comes across. This can come in handy when considering nested routes.*/}
        <Switch>
          {/*exact: home or login screen will only be displayed if it matches the / path exactly*/}
          <Route exact path="/" component={LoginSignUpScreen}/>
          <Route path ="/register" component={RegisterScreen}/>
          <PrivateRoute path="/dashboard" component={Dashboard}/>        
        </Switch>
      </div>
    </Router>
  );
}

export default App;
