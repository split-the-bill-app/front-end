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
    
  let [iterator, setIterator] = useState(0);
  const [numNotifications, setNumNotifications] = useState(props.notifications.length);
  const numPeople = props.numPeople - 1;
  //let inputsToDisplay = numPeople - numNotifications;

  let[inputsToDisplay, setInputsToDisplay] = useState(numPeople - numNotifications);  
  
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

  console.log("number of notifs", numNotifications); 
  console.log("number of ppl", numPeople); 
  console.log("inputsToDisplay", inputsToDisplay); 
  console.log("inputs.length", inputs.length); 
    
  useEffect(() => {

    //get all notifications of a bill
    axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${props.expenseId}/notifications`)
    .then(res => {
      setNotificationsBeforeAdding(res.data);
      console.log("notificationsBeforeAdding right after axios call", notificationsBeforeAdding);
    })
    .catch(err => {
      console.log("get all notifications of a bill before adding error", err);
    })

  }, [])

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
    console.log('newnotifs in handleChange: ', newNotifications);
   
  }

  // reset inputs and post the newNotifications object
  const submitNotifications = (e) => {
    var nonDupNotifs = [];

    e.preventDefault();    

    console.log("notifications before adding in submitNotifications", notificationsBeforeAdding);    

    console.log("newNotifications.email[0]", newNotifications.email[0]);   

    //filter newNotifications.email to make sure duplicate email addresses are not being sent for the same bill
    var filterNewNotifications = newNotifications.email.filter( function (item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
    });
    
    //display window alert if the same email was entered more than once in the input fields before submission
    if(filterNewNotifications.length !== newNotifications.email.length){
      window.alert("You entered the following email address(es) more than once:\n" +
                    filterNewNotifications.join("\n") + "\n\n" +
                   "Please check your entries and try again.");

      console.log("filterNewNotifications", filterNewNotifications);

    } else {//if duplicate values were not entered before hitting send
    
      //check if any of the emails were already sent for that bill    
      var emailsAlreadyAdded = notificationsBeforeAdding.filter(function(o1){
        // filter out (!) items in result2
        return newNotifications.email.some(function(o2){
            return o1.email === o2;          // assumes unique id
        });
      
      });

      //extract the email addresses from emailsAlreadyAdded
      const resultEmails = emailsAlreadyAdded.map(result => {
        return result.email;
      })

      console.log("result emails", resultEmails);

      console.log("newNotifications.email", newNotifications.email);

      //if they were already added display a window.alert with the duplicate email adresses
      if(emailsAlreadyAdded.length > 0){          
        window.alert("You already sent notification(s) for this bill to: \n" + resultEmails.join("\n") + "\n\n" +
                     "Please delete the existing notification(s) for the email address(es) listed if you would like to resend.")               
        
      }//end if

    else {             

      axiosWithAuth().post('https://split-the-bill-app.herokuapp.com/api/notifications', newNotifications)
        .then(res => {
          setNewNotifications({
            bill_id: props.expenseId,
            email: []
          })
          axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${props.expenseId}/notifications`)
            .then(res => {
              //console.log("notifications for a specific bill in send notification form", res);
              props.setNotifications(res.data);
              setNumNotifications(res.data.length);
              console.log("props.notifications.length after axios get", res.data.length);

              //reset the number of inputs to display after send is clicked
              setInputsToDisplay(numPeople - res.data.length);
              console.log("num inputs to display after axios get", inputsToDisplay);
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

      }//end emailsAlreadyAdded else

    }//end filterNewNotifications else

  }//end submitNotifications

  const deleteInput = (event, i) => {
    event.preventDefault();
    setInputs(inputs.filter((input, index) => index !== i));
    console.log("input", inputs);
  }     

  
  return (

    numNotifications < numPeople ?    
    
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

      <button  className="send-notification-btn" type="submit">Send</button>

      {inputs.length < inputsToDisplay ? 
      <button        
        type="button"
        className="send-notification-btn"
        onClick={(e) => {
          return console.log("clicked"),              
          addInput(e)      
        }}>
          Add Another Email
        </button>

        :

        null
        
      }

      </div>     
              

    </form>    

    :

    <p> You already sent {numNotifications}/{numPeople} notification(s) for this bill. Delete a notification on the Manage Sent Notifications modal to send a new notification.</p>
   
  );
}

export default SendNotificationForm;
