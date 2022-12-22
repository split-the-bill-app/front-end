import React, {useEffect} from "react";
import { connect } from "react-redux";
import { 
        getAllExpenses,
        getAllSentNotificationsForABill,
        getAllSentOwedNotifications, 
        getAllSentPaidNotifications, 
        deleteSentNotification,
        updateNotificationPaidStatus
    } from "../redux_store/actions";
import { Icon } from "semantic-ui-react";

function ManageNotifications(props){
       
    useEffect(() => {                    
        //the formula in dashboard that calculates how much your friends owe you
        //require all expenses, the owed notifications, and the paid notifications
        //we then display all notifications for this bill        
        props.getAllExpenses(localStorage.getItem('userId'));

        props.getAllSentOwedNotifications(localStorage.getItem('userId'));
       
        props.getAllSentPaidNotifications(localStorage.getItem('userId'));

        props.getAllSentNotificationsForABill(props.expenseId);  
             
    }, []) 

       
    //get all notifications when a notifiction is deleted or updated
    useEffect(() => {               
        props.getAllExpenses(localStorage.getItem('userId'));

        props.getAllSentOwedNotifications(localStorage.getItem('userId'));

        props.getAllSentPaidNotifications(localStorage.getItem('userId')); 

        props.getAllSentNotificationsForABill(props.expenseId);   

    }, [props.deleteSentNotificationSuccess, props.updateNotificationPaidStatusSuccess])
                 
    const deleteNotification = async (event, notificationIn) => {        
        event.preventDefault();
        event.stopPropagation();

        try{
            //delete the notification
            await props.deleteSentNotification(notificationIn.id);            
                   
            await props.getAllExpenses(localStorage.getItem('userId'));  

            await props.getAllSentOwedNotifications(localStorage.getItem('userId'));

            await props.getAllSentPaidNotifications(localStorage.getItem('userId')); 

            //reset the all sent notifications for a bill state
            await props.getAllSentNotificationsForABill(props.expenseId);             

        }catch(err){
            console.error("Delete Notification in ManageNotification.js ERROR", err);
        }  

    }//end deleteNotification   

    const paidHandler = async (event, notificationId) => {  
        event.preventDefault();
        event.stopPropagation();

        let paidStatus = event.target.value;

        try{        
            {event.target.value === "paid" ? paidStatus = true : paidStatus = false}           
            
            //update notification
            await props.updateNotificationPaidStatus(notificationId, {paid: paidStatus});            
                      
            await props.getAllExpenses(localStorage.getItem('userId'));  
            
            await props.getAllSentOwedNotifications(localStorage.getItem('userId'));

            await props.getAllSentPaidNotifications(localStorage.getItem('userId'));
            
            await props.getAllSentNotificationsForABill(props.expenseId);                    
        
        }catch(err){
            console.error("Update Notification in ManageNotification.js ERROR", err);
        }        
        
    }//end paidHandler

    return (
        <div className="manage-notifications">            
            {          
            (props.allSentNotifications.length > 0) ?
                props.allSentNotifications.map((notification, index) => {
                    return <div className="notification" key={index}>                        
                        {notification.email !== null && notification.email.length > 10 ? (
                                <p className = "email">{notification.email.slice(0, 13)}...</p>
                            ): (
                                <p className = "email">{notification.email}</p>
                            )
                        }

                        <p>${notification.split_each_amount} </p>                   
                        <p className = "description">{notification.description}</p>

                        <p className = "paid-select">
                            <select 
                                key={notification.id}                                           
                                type="select"
                                name="payment"    
                                onChange={(e) => paidHandler(e, notification.id)}
                                className = "paid-select"> 

                                <option value ="" disabled selected hidden>{notification.paid ? "paid" : "unpaid"}</option>
                                <option value = "paid">paid</option>
                                <option value = "unpaid">unpaid</option>                         

                            </select>                    
                        </p>
                        <p className = "delete-p">
                            <Icon onClick={(e) => deleteNotification(e, notification)} className = "delete-notification-icon" name='delete' />
                        </p>
                    </div>
                    })
            : <p>You haven't sent any notifications for this bill.</p>
            }
        </div>             
    );
}

const mapStateToProps = state => {
    return {
        //all sent notifications for a single bill
        getAllSentNotificationsError: state.notificationsReducerIndex.getAllSentNotificationsError,
        isGettingAllSentNotifications: state.notificationsReducerIndex.isGettingAllSentNotifications,
        getAllSentNotificationsSuccess: state.notificationsReducerIndex.getAllSentNotificationsSuccess,
        allSentNotifications: state.notificationsReducerIndex.allSentNotifications,
        //your friends owe you
        getAllSentOwedNotificationsError: state.notificationsReducerIndex.getAllSentOwedNotificationsError,
        isGettingAllSentOwedNotifications: state.notificationsReducerIndex.isGettingAllSentOwedNotifications,
        getAllSentOwedNotificationsSuccess: state.notificationsReducerIndex.getAllSentOwedNotificationsError,
        allSentOwedNotifications: state.notificationsReducerIndex.allSentOwedNotifications,
        //your friends paid what they owe you
        getAllSentPaidNotificationsError: state.notificationsReducerIndex.getAllSentPaidNotificationsError,
        isGettingAllSentPaidNotifications: state.notificationsReducerIndex.isGettingAllSentPaidNotifications,
        getAllSentPaidNotificationsSuccess: state.notificationsReducerIndex.getAllSentPaidNotificationsSuccess,
        allSentPaidNotifications: state.notificationsReducerIndex.allSentPaidNotifications, 
        //delete individual sent notifications
        deleteSentNotificationError: state.notificationsReducerIndex.deleteSentNotificationError, 
        isDeletingSentNotification: state.notificationsReducerIndex.isDeletingSentNotification,
        deleteSentNotificationSuccess: state.notificationsReducerIndex.deleteSentNotificationSuccess,
        deleteSentNotificationConfirmation: state.notificationsReducerIndex.deleteSentNotificationConfirmation,
        //update a notification from paid to unpaid or unpaid to paid
        updateNotificationPaidStatusError: state.notificationsReducerIndex.updateNotificationPaidStatusError, 
        isUpdatingNotificationPaidStatus: state.notificationsReducerIndex.isUpdatingNotificationPaidStatus,
        updateNotificationPaidStatusSuccess: state.notificationsReducerIndex.updateNotificationPaidStatusSuccess,
        updateNotificationPaidStatusConfirmation: state.notificationsReducerIndex.updateNotificationPaidStatusConfirmation 
    }
}

export default connect(
    mapStateToProps, { 
    getAllExpenses,
    getAllSentNotificationsForABill,
    getAllSentOwedNotifications, 
    getAllSentPaidNotifications, 
    deleteSentNotification,
    updateNotificationPaidStatus
})(ManageNotifications);