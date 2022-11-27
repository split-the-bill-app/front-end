import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getAllSentNotificationsForABill, sendNotificationsForABill } from "../redux_store/actions";
import { Icon } from 'semantic-ui-react';

function SendNotificationForm(props) {     

  //- 1 because the person sending the bill is excluded from the number of notification recipients
  const numPeople = props.numPeople - 1;  
  const [numNotifications, setNumNotifications] = useState(props.allSentNotifications.length);
  let[inputsToDisplay, setInputsToDisplay] = useState(numPeople - numNotifications);    
  const [notificationsBeforeAdding, setNotificationsBeforeAdding] = useState([]);

  const [newNotifications, setNewNotifications] = useState({
    bill_id: props.expenseId,
    email: []
  });

  const [inputs, setInputs] = useState([
    {
      name: "email",
      type: "email",
      placeholder: "Enter Your Friend's Email",
      value: ''
    }
  ]);  
    
  useEffect(() => {
    //get all sent notifications for a bill when the form loads
    props.getAllSentNotificationsForABill(props.expenseId);   
  }, []);

  useEffect(() => {
    if(props.allSentNotifications){
      setNotificationsBeforeAdding(props.allSentNotifications);        

      //set the number of notifications
      setNumNotifications(props.allSentNotifications.length);

      //reset the number of inputs to display after send is clicked
      setInputsToDisplay(numPeople - props.allSentNotifications.length);
    }

  }, [props.allSentNotifications]);

  useEffect(() => {
    //get all sent notifications for a bill
    props.getAllSentNotificationsForABill(props.expenseId);   

  }, [props.sentNotificationsConfirmation])  

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
  }

  const handleChange = (event, i) => {
    event.preventDefault();    
    inputs[i].value = event.target.value;     
    
    setNewNotifications({
      ...newNotifications,
      email: inputs.map(input => input.value)
    })   
  }

  // reset inputs and post the newNotifications object
  const submitNotifications = (e) => {
    var nonDupNotifs = [];
    e.preventDefault();    
   
    //filter newNotifications.email to make sure duplicate email addresses are not being sent for the same bill
    var filterNewNotifications = newNotifications.email.filter( function (item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
    });
    
    //display window alert if the same email was entered more than once in the input fields before submission
    if(filterNewNotifications.length !== newNotifications.email.length){
      window.alert("You entered the following email address(es) more than once:\n" +
                    filterNewNotifications.join("\n") + "\n\n" +
                   "Please check your entries and try again.");

    } 
    else {//if duplicate values were not entered before hitting send
    
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

      //if they were already added display a window.alert with the duplicate email adresses
      if(emailsAlreadyAdded.length > 0){          
        window.alert("You already sent notification(s) for this bill to: \n" + resultEmails.join("\n") + "\n\n" +
                     "Please delete the existing notification(s) for the email address(es) listed if you would like to resend.")               
        
      }//end if

    else {             
      props.sendNotificationsForABill(newNotifications);

      //reset newNotifications
      setNewNotifications({
        bill_id: props.expenseId,
        email: []
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

      window.location.reload(true);

      }//end emailsAlreadyAdded else      

    }//end filterNewNotifications else   

  }//end submitNotifications

  const deleteInput = (event, i) => {
    event.preventDefault();
    setInputs(inputs.filter((input, index) => index !== i));
  }   
  
  return (     
    numNotifications < numPeople ?      
    <form 
      onSubmit={(e) => submitNotifications(e)} 
      className="send-notification-form">                  
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

        {/*ADDS ANOTHER INPUT FIELD WHEN CLICKED */}   
        {inputs.length < inputsToDisplay ? 
          <button        
            type="button"
            className="send-notification-btn"
            onClick={(e) => {
              return console.log("add another email clicked"),              
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
}//end SendNotificationForm

const mapStateToProps = state => {
  return {
    getAllSentNotificationsError: state.notificationsReducerIndex.getAllSentNotificationsError,
    isGettingAllSentNotifications: state.notificationsReducerIndex.isGettingAllSentNotifications,
    getAllSentNotificationsSuccess: state.notificationsReducerIndex.getAllSentNotificationsSuccess,
    allSentNotifications: state.notificationsReducerIndex.allSentNotifications,
    sendNotificationsError: state.notificationsReducerIndex.sendNotificationsError,
    isSendingNotifications: state.notificationsReducerIndex.isSendingNotifications,
    sendNotificationsSuccess: state.notificationsReducerIndex.sendNotificationsSuccess,
    sentNotificationsConfirmation: state.notificationsReducerIndex.sentNotificationsConfirmation
  }
}

export default connect(
  mapStateToProps, {
                    getAllSentNotificationsForABill, 
                    sendNotificationsForABill
                  })
  (SendNotificationForm);