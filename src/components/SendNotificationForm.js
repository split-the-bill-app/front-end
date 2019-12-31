import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

import ExpenseDetails from "./ExpenseDetails.js";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";
import { Icon } from 'semantic-ui-react';

function SendNotificationForm(props) {  

  const [newNotifications, setNewNotifications] = useState({
    bill_id: props.expenseId,
    email: []
  })

  const [inputs, setInputs] = useState([
    {
      name: "email",
      type: "email",
      placeholder: "Enter Your Friend's Email",
      value: ''
    }
  ])

  //adds another input field
  const addInput = (e) => {
    e.preventDefault();
    setInputs([
      ...inputs, 
      {
        name: "email",
        type: "email",        
        placeholder: "Enter Your Friend's Email"
      }
      ])
      
  }//end addInput

  // update the shape of the newNotifications object
  // according to the input we get from the user
  const handleChange = (event, i) => {
    event.preventDefault();
    inputs[i].value = event.target.value;
    console.log("inputs", inputs);
    setNewNotifications({
      ...newNotifications,
      email: inputs.map(input => input.value)
    })
    console.log('newnotifs: ', newNotifications);
  }

  // reset inputs and post the newNotifications object
  const submitNotifications = (e) => {
    console.log("new notifications in send notification form", newNotifications);

    e.preventDefault();
    
    axiosWithAuth().post('https://split-the-bill-app.herokuapp.com/api/notifications', newNotifications)
      .then(res => {
        setNewNotifications({
          bill_id: props.expenseId,
          email: []
        })
        axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${props.expenseId}/notifications`)
          .then(res => {
            console.log("notifications for a specific bill in send notification form", res);
            props.setNotifications(res.data);
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch(err => {
        console.log(err);
      })

      // reset inputs
      setInputs([
        {
          name: "email",
          type: "email",          
          placeholder: "Enter Your Friend's Email",
          value: ''          
        }
      ]);

  }//end submitNotifications

  const deleteInput = (event, i) => {
    event.preventDefault();
    setInputs(inputs.filter((input, index) => index !== i));
    console.log("input", inputs);
  }  

  axiosWithAuth().get('https://split-the-bill-app.herokuapp.com/api/notifications')
    .then(res => {
      console.log("all notifications in send notification form", res);
    })   
  

  return (

    <form 
    onSubmit={(e) => submitNotifications(e)} 
    className="send-notification-form">

      {/*THIS BUTTON ADDS ANOTHER INPUT FIELD WHEN CLICKED */}
      
      {inputs.map((input, index) => {
        return (
          <div key={index}>
            <input 
            onChange={(event) => handleChange(event, index)}
            placeholder={input.placeholder} 
            name={input.name}
            value={input.value}
            type="email"
            required
            />
            <Icon 
            onClick={(event) => deleteInput(event, index)} 
            className="delete-icon" 
            name="delete"
            />
          </div>
        )
      })}
      
      <div className = "button-div">
        <button className="send-notification-btn" type="submit">Submit</button>

        <button 
        type="button"
        className="send-notification-btn"
        onClick={(e) => addInput(e)}>
          Add Another Email
        </button>
      </div>

    </form>
   
  );
}

export default SendNotificationForm;
