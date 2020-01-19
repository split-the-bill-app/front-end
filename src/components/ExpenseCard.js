import React, { useState, useEffect } from 'react';
import { Icon, Card, Modal, Popup } from "semantic-ui-react";
import 'semantic-ui-css/semantic.css'; 
import 'semantic-ui-css/semantic.min.css'; 
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

  //delete confirmation modal
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

    window.location.reload(true);

  }

  return (

    <div className = "expense-card-div">

    {/* semantic ui card component that displays each expense details */}
    <Card>
      <Card.Content>
        <Card.Header> {`Bill # ${props.expenseId}`}  
      
        {/*DELETE CONFIRMATION MODAL THAT APPEARS WHEN X IS CLICKED ON EACH BILL */}
        <Icon className = "delete-icon" name='delete' onClick={handleClickOpen}/>
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">

        <DialogTitle id="alert-dialog-title">{"Delete Bill"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
             Are you sure you want to delete this bill? This will completely remove this bill and its
             notifications for everyone involved, not just you.              
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button class = "delete-bill-button" onClick={(e) => deleteExpense(e, props.expense)}>
            DELETE
          </Button>
          <Button class = "cancel-delete-bill-button" onClick={handleClose} color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

        
        
        </Card.Header>

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
            {`Notes: ${props.expense.notes}`}
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

        {/*MODAL THAT TRIGGERS SENT/MANAGE NOTIFICATIONS */}
        <Modal trigger = {
        <div>
        <Popup content='Click to Manage Sent Notifications' inverted style = {style} trigger = {        
        <Icon  className = "dollar-icon" name="mail" size = "large" /> 
        }/>
        </div>             
        } closeIcon >

        <Modal.Header>Manage Sent Notifications</Modal.Header>

        <Modal.Content image scrolling>          
        
        {notifications.length > 0 ? 
        <ManageNotifications 
          notifications = {notifications} 
          setNotifications = {setNotifications}
          setPaidBillsTotal = {props.setPaidBillsTotal}
          setOwedNotifications = {props.setOwedNotifications}
          setOwedNotificationsCount = {props.setOwedNotificationsCount}
          setOwedNotificationsTotal = {props.setOwedNotificationsTotal}
          setExpenses = {props.setExpenses}
        /> 
        : 
        <p>You haven't sent any notifications for this bill.</p> }   

         </Modal.Content>   

        </Modal>      
                  
      </Card.Content>

    </Card>
   
  </div>

  );
}