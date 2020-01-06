import React, { useState, useEffect } from 'react';
import { Icon, Card, Modal, Popup } from "semantic-ui-react";
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import 'semantic-ui-css/semantic.css'; 
import 'semantic-ui-css/semantic.min.css'; 
import { axiosWithAuth } from "../utils/axiosWithAuth";

import AddExpenseForm from "./AddExpenseForm";
import EditExpenseForm from "./EditExpenseForm";
import ManageNotifications from "./ManageNotifications";
import EmptyNotifications from "./ManageNotifications";

import SendNotificationForm from "./SendNotificationForm";

//popup/tooltip style
const style = {    
    opacity: 0.7,    
}

export default function ExpenseCard(props) { 
  
  // keeps track of expenses
  const [expenses, setExpenses] = useState([]);
  // keeps track of notifications
  const [notifications, setNotifications] = useState([])  

  //console.log("props.expense.id", props.expense.id);

  useEffect(() => {
    axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${props.expense.id}/notifications`)
      .then(res => {
        //console.log(res);
        setNotifications(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [notifications])  
  

  {/* calculate what each person owes. not used anymore, 
      this is calculated in AddExpenseForm and stored in the db */}
  const splitBill = (props.total/props.numpeople).toFixed(2);
  
  const deleteExpense = (e, expense) => {
    e.preventDefault();
    if(notifications.length > 0) {
      axiosWithAuth().delete(`https://split-the-bill-app.herokuapp.com/api/bills/${expense.id}/notifications`)
        .then(res => {
          console.log(res);
          setNotifications([]);
          axiosWithAuth().delete(`https://split-the-bill-app.herokuapp.com/api/bills/${expense.id}`)
            .then(res => {
              console.log(res);
              // filter out the expense we just deleted using its "id"
              props.setExpenses(props.expenses.filter(expense => expense.id !== props.expense.id))
            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      axiosWithAuth().delete(`https://split-the-bill-app.herokuapp.com/api/bills/${expense.id}`)
        .then(res => {
          console.log(res);
          // filter out the expense we just deleted using its "id"
          props.setExpenses(props.expenses.filter(expense => expense.id !== props.expense.id))
        })
        .catch(err => {
          console.log(err);
        })
    }
  }   
  
    
  return (

    <div className = "expense-card-div">

    {/* semantic ui card component that displays each expense details */}
    <Card>
      <Card.Content>
        <Card.Header> {`Bill # ${props.expenseId}`}  <Icon onClick={(e) => deleteExpense(e, props.expense)} className = "delete-icon" name='delete' /> </Card.Header>

        <Card.Description>
          {`Date: ${props.date}`}
        </Card.Description>

        <Card.Description>
          {`Bill Total: $${props.total}`}
        </Card.Description>

        <Card.Description>
          {`Number of people: ${props.numpeople}`}
        </Card.Description>   

         <Card.Description>
         <Icon name="money bill alternate" />
          {`Each of your friends owe you: $${props.expense.split_each_amount}`}
        </Card.Description>     

        <Card.Description className="sent-notifications">
            {`Details: ${props.expense.description}`}
        </Card.Description>        

      </Card.Content>

      <Card.Content extra className = "expense-card-modal">     

        {/*MODAL THAT TRIGGERS THE EDIT EXPENSE FORM */}
        <Modal trigger = { 
        <div>
        <Popup content='Click to Edit Bill' inverted style = {style} trigger = {
       
        <Icon  className = "edit-icon" name="edit" size = "large" /> 
       
        }/>
        </div>

        }closeIcon>

        <Modal.Header>Edit Expense</Modal.Header>

          <EditExpenseForm expenseId={props.expenseId} addExpense = {props.addExpense} editExpense={props.editExpense} />                                   

        </Modal>   

        {/*<Icon onClick={(e) => editExpense (e, props.expense)} name="edit outline" />  */}               
          

        {/*MODAL THAT TRIGGERS SEND NOTIFICATION /> */}             
        <Modal trigger = {
        <div>
        <Popup content='Click to Send Notifications' inverted style = {style} trigger = {
        <Icon className = "mail-icon" name="send" size = "large" />   
        }/>
        </div>        
        } closeIcon>

        <Modal.Header>Notify Friends</Modal.Header>        

        <SendNotificationForm numPeople = {props.numpeople} notifications = {notifications} setNotifications={setNotifications} expenseId={props.expenseId}/>                                   

        </Modal>   

        {/*MODAL THAT TRIGGERS SENT NOTIFICATIONS */}
        <Modal trigger = {
        <div>
        <Popup content='Click to Manage Sent Notifications' inverted style = {style} trigger = {        
        <Icon  className = "dollar-icon" name="mail" size = "large" /> 
        }/>
        </div>             
        } closeIcon>

        <Modal.Header>Manage Sent Notifications</Modal.Header>

        <Modal.Content image scrolling>          
        
        {notifications.length > 0 ? 
        <ManageNotifications notifications = {notifications} setNotifications = {setNotifications}/> 
        : 
        <p>You haven't sent any notifications for this bill.</p> }   

         </Modal.Content>   

        </Modal>      
                  
      </Card.Content>

    </Card>
   
  </div>

  );
}