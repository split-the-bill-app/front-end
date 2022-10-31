import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { 
  getAllExpenses,
  deleteExpense,
  deleteSentNotificationsForABill,   
  getAllSentNotificationsForABill,
  getAllSentOwedNotifications,
  getAllSentPaidNotifications
  } from "../redux_store/actions";
import { Icon, Card, Modal, Popup } from "semantic-ui-react";
import 'semantic-ui-css/semantic.css'; 
import 'semantic-ui-css/semantic.min.css'; 
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditExpenseForm from "./EditExpenseForm";
import ManageNotifications from "./ManageNotifications";
import SendNotificationForm from "./SendNotificationForm";

//popup/tooltip style
const style = {    
    opacity: 0.7,    
}

function ExpenseCard(props) {
  //delete confirmation modal
  const [open, setOpen] = React.useState(false);

  //delete confirmation modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  //delete confirmation modal
  const handleClose = () => {
    setOpen(false);
  };

  //manage sent notifications modal refresh when closed
  const closeManageNotificationsModal = (e) => {   
    //window.location.reload(true);
  }  

  //when the mail icon on expense card is clicked get all notifications for the bill
  const launchManageNotifications = (e) => {
    props.getAllSentNotificationsForABill(props.expenseId); 
  }

  useEffect(() => {
    //get all notifications sent for this bill
    props.getAllSentNotificationsForABill(props.expenseId);    
  },[]); 

  
  //every time a notification is sent, updated, or deleted
  useEffect(() => {

    //get all notifications sent for this bill
    props.getAllSentNotificationsForABill(props.expenseId);    

  }, [props.sentNotificationsConfirmation, 
      /***adding the below two dependencies results in  props.getAllSentNotificationsForABill() being called consecutively
      with each expense id (all the expenses on the dashboard) and not just the current expense. 
      this causes inaccurate results - the notifications for the last bill is displayed - regardless of the currrent bill
      on the ManageNotifications panel***/
      //props.updateNotificationPaidStatusConfirmation,
      //props.deleteSentNotificationConfirmation
    ])
 
  const deleteHandler = async (e, expenseIn) => {

    e.preventDefault();

    //if there are notifications for a bill, delete them first before deleting the bill
    if(props.allSentNotifications.length > 0) {
      //delete sent notifications
      await props.deleteSentNotificationsForABill(expenseIn.id);

      //then get all notifications which should reset allSentNotiications to []
      await props.getAllSentNotificationsForABill(props.expenseId);

      //then delete the bill
      await props.deleteExpense(expenseIn.id);

      //reset the all expenses state
      await props.getAllExpenses(localStorage.getItem('userId'));
     
    } else {

      //if there are no notifications for a bill
      await props.deleteExpense(expenseIn.id);   
      
      //reset the all expenses state
      await props.getAllExpenses(localStorage.getItem('userId'));           
    }

    window.location.reload(true);

  }//end deleteExpense

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
                  <Button className = "delete-bill-button" onClick={(e) => deleteHandler(e, props.expenseFromDashboard)}>
                    DELETE
                  </Button>
                  <Button className = "cancel-delete-bill-button" onClick={handleClose} color="primary">
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
          {`Number of people: ${props.numPeople}`}
        </Card.Description>   

        <Card.Description>
         <Icon name="money bill alternate" />
          {`Each of your friends owe you: $${props.expenseFromDashboard.split_each_amount}`}
         </Card.Description>   

        {props.expenseFromDashboard.notes && props.expenseFromDashboard.notes.length > 0 ? 
          <Card.Description className="sent-notifications">
              {`Notes: ${props.expenseFromDashboard.notes}`}
          </Card.Description>
          :
        null}

      {props.expenseFromDashboard.description && props.expenseFromDashboard.description.length > 0 ? 

        <Card.Description className="sent-notifications">
            {`Details: ${props.expenseFromDashboard.description}`}
        </Card.Description>       
        :
        null}

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

          <EditExpenseForm expenseId={props.expenseId} />                                   

        </Modal>  

        {/*MODAL THAT TRIGGERS SEND NOTIFICATION FORM/> */}             
        <Modal trigger = {
        <div>
        <Popup content='Click to Send Notifications' inverted style = {style} trigger = {
        <Icon className = "mail-icon" name="send" size = "large" />   
        }/>
        </div>        
        } closeIcon>

        <Modal.Header>Notify Friends</Modal.Header>        

        <SendNotificationForm 
            numPeople = {props.numPeople}            
            expenseId={props.expenseId}/>                                   

        </Modal>   

        {/*MODAL THAT TRIGGERS SENT/MANAGE NOTIFICATIONS */}
        <Modal trigger = {
        <div>
        <Popup content='Click to Manage Sent Notifications' inverted style = {style} trigger = {        
        <Icon  onClick = {launchManageNotifications} className = "dollar-icon" name="mail" size = "large" /> 
        }/>
        </div>                   
        } 
        onClose={closeManageNotificationsModal} 
        closeIcon >

        <Modal.Header>Manage Sent Notifications</Modal.Header>

         <Modal.Content image scrolling>      
        
          <ManageNotifications 
            expenseId = {props.expenseId}                           
          />       

         </Modal.Content>   

        </Modal>      
                  
      </Card.Content>

    </Card>
   
  </div>

  );

}//end ExpenseCard

const mapStateToProps = state => {
  return {
    //delete a bill
    deleteExpenseError: state.expensesReducerIndex.deleteExpenseError,
    isDeletingExpense: state.expensesReducerIndex.isDeletingExpense,
    deleteExpenseSuccess: state.expensesReducerIndex.deleteExpenseSuccess,
    deleteExpenseConfirmation: state.expensesReducerIndex.deleteExpenseConfirmation,
     //expenses
     getAllExpensesError: state.expensesReducerIndex.getAllExpensesError,
     isGettingAllExpenses: state.expensesReducerIndex.isGettingAllExpenses,
     allExpenses: state.expensesReducerIndex.allExpenses,
     getAllExpensesSuccess: state.expensesReducerIndex.getAllExpensesSuccess,
    //edit expense
    editExpenseSuccess: state.expensesReducerIndex.editExpenseSuccess,
    //delete all notifications for a single bill
    deleteAllBillNotificationsError: state.notificationsReducerIndex.deleteAllBillNotificationsError, 
    isDeletingAllBillNotifications: state.notificationsReducerIndex.isDeletingAllBillNotifications,
    deleteAllBillNotificationsSuccess: state.notificationsReducerIndex.deleteAllBillNotificationsSuccess,
    deleteAllBillNotificationsConfirmation: state.notificationsReducerIndex.deleteAllBillNotificationsConfirmation,
    //delete individual sent notifications
    deleteSentNotificationError: state.notificationsReducerIndex.deleteSentNotificationError, 
    isDeletingSentNotification: state.notificationsReducerIndex.isDeletingSentNotification,
    deleteSentNotificationSuccess: state.notificationsReducerIndex.deleteSentNotificationSuccess,
    deleteSentNotificationConfirmation: state.notificationsReducerIndex.deleteSentNotificationConfirmation,
    //get all sent notifications for a bill
    getAllSentNotificationsError: state.notificationsReducerIndex.getAllSentNotificationsError,
    isGettingAllSentNotifications: state.notificationsReducerIndex.isGettingAllSentNotifications,
    getAllSentNotificationsSuccess: state.notificationsReducerIndex.getAllSentNotificationsSuccess,
    allSentNotifications: state.notificationsReducerIndex.allSentNotifications,
    //your friends owe you
    getAllSentOwedNotificationsError: state.notificationsReducerIndex.getAllSentOwedNotificationsError,
    isGettingAllSentOwedNotifications: state.notificationsReducerIndex.isGettingAllSentOwedNotifications,
    getAllSentOwedNotificationsSuccess: state.notificationsReducerIndex.getAllSentOwedNotificationsSuccess,
    allSentOwedNotifications: state.notificationsReducerIndex.allSentOwedNotifications,
    //send a notification
    sendNotificationsError: state.notificationsReducerIndex.sendNotificationsError,
    isSendingNotifications: state.notificationsReducerIndex.isSendingNotifications,
    sendNotificationsSuccess: state.notificationsReducerIndex.sendNotificationsSuccess,
    sentNotificationsConfirmation: state.notificationsReducerIndex.sentNotificationsConfirmation,
    //update a notification from paid to unpaid or unpaid to paid
    updateNotificationPaidStatusError: state.notificationsReducerIndex.updateNotificationPaidStatusError, 
    isUpdatingNotificationPaidStatus: state.notificationsReducerIndex.isUpdatingNotificationPaidStatus,
    updateNotificationPaidStatusSuccess: state.notificationsReducerIndex.updateNotificationPaidStatusSuccess,
    updateNotificationPaidStatusConfirmation: state.notificationsReducerIndex.updateNotificationPaidStatusConfirmation,
    //your friends paid what they owe you
    getAllSentPaidNotificationsError: state.notificationsReducerIndex.getAllSentPaidNotificationsError,
    isGettingAllSentPaidNotifications: state.notificationsReducerIndex.isGettingAllSentPaidNotifications,
    getAllSentPaidNotificationsSuccess: state.notificationsReducerIndex.getAllSentPaidNotificationsSuccess,
    allSentPaidNotifications: state.notificationsReducerIndex.allSentPaidNotifications, 
  };
}

export default connect(mapStateToProps, 
  { 
    getAllExpenses,
    deleteExpense, 
    deleteSentNotificationsForABill,    
    getAllSentNotificationsForABill,
    getAllSentOwedNotifications,
    getAllSentPaidNotifications 
  })
  (ExpenseCard);

