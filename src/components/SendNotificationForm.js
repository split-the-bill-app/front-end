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
    e.preventDefault();        
    var duplicateNewEmails = [];
   
    //to prevent duplicate email addresses from being added for the same bill
    newNotifications.email.filter( (item, index, emailArray) => {     
        if(emailArray.indexOf(item) !== index){          
          duplicateNewEmails.push(item);
        }
    });
        
    //display window alert if duplicate emails are entered in the input fields before submission
    if(duplicateNewEmails.length > 0){
        window.alert("You entered the following email address(es) more than once:\n" +
                    duplicateNewEmails.join("\n") + "\n\n" +
                   "Please check your entries and try again.");
    } 
    else {//if duplicate values were not entered before hitting send
    
      //check if any of the emails were already sent for that bill    
      var emailsAlreadyAdded = notificationsBeforeAdding.filter(function(o1){
        // filter out (!) items in result2
        return newNotifications.email.some(function(o2){
            //check if any of the emails in newNotifications match those in notificationsBeforeAdding
            return o1.email === o2;
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
        
      }

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

    }//end duplicateNewEmails else   

  }//end submitNotifications

  const deleteInput = (event, i) => {
    event.preventDefault();
    setInputs(inputs.filter((input, index) => index !== i));

    let updatedNewNotifications = newNotifications.email.filter( (item, index) => {
      return index !== i;
    }); 
    
    newNotifications.email = [...updatedNewNotifications];
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
            onClick={ (e) => addInput(e) }>
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