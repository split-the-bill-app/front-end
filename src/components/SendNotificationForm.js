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

  const [notificationsBeforeAdding, setNotificationsBeforeAdding] = useState([]);

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

    const newNotificationsBeforeAdding = notificationsBeforeAdding.filter((notification, index) => {
      console.log("email in newNotifications.email", newNotifications.email[index])
      console.log("notification.email", notification.email)
      return notification.email !== inputs[i].value
      
    })    

    console.log("inputs[i].value", inputs[i].value);
    console.log('notificationsBeforeAdding after filter in handleChange ', newNotificationsBeforeAdding);

    console.log("inputs", inputs);

    setNewNotifications({
      ...newNotifications,
      email: inputs.map(input => input.value)
    })
    console.log('newnotifs in handleChange: ', newNotifications);
  }

  // reset inputs and post the newNotifications object
  const submitNotifications = (e) => {
    console.log("new notifications in send notification form", newNotifications);

    e.preventDefault();    

    /*const newNotificationsBeforeAdding =  notificationsBeforeAdding.filter((notification, index) => {
      console.log("email in newNotifications.email", newNotifications.email[index])
      console.log("notification.email", notification.email)
      return notification.email === newNotifications.email[index]
      
    })

    console.log("notificationsBeforeAdding after filter", newNotificationsBeforeAdding);

    //if the email was already sent for this bill
    if(notificationsBeforeAdding.length > 0){

      //add the email addresses only to notificationsBeforeAdding
      const printEmails = notificationsBeforeAdding.filter(notificationEmail => {
        return notificationEmail.email

      })

      //and display an alert message with the email addresses
      window.alert(`You already sent a notification to ${notificationsBeforeAdding}`);

      //and filter through all the notifications to be added and only send to email addresses 
      //that were not already sent to
      newNotifications.email.filter((notificationsToAdd, index) => {
        return notificationsToAdd !== notificationsBeforeAdding[index].email
      })
    }*/    
    
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

  //get all notifications of a bill before adding a notification
  axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${props.expenseId}/notifications`)
  .then(res => {
   setNotificationsBeforeAdding(res.data);
   console.log("notificationsBeforeAdding right after axios call", notificationsBeforeAdding);
  })
  .catch(err => {
   console.log(err);
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
        <button className="send-notification-btn" type="submit">Send</button>

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
