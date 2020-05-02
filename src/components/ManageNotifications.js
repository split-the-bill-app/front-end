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

        props.getAllSentNotificationsForABill(props.expenseFromDashboard.id); 
        
        props.getAllExpenses(localStorage.getItem('userId'));
             
    }, []) 

    useEffect(() => {
        props.getAllSentOwedNotifications(localStorage.getItem('userId'));

        //when props.getAllSentOwedNotifications() is called props.allSentOwedNotifications is updated
        //in dashboard so
        //props.setOwedNotifications(res.data); becomes props.allSentOwedNotifications
        //and props.setOwedNotifications(res.data) is therefore not needed
        //so i wouldn't need this => setOwedNotifications = {setOwedNotifications} 
        //when props.allSentOwedNotifications is updated, a useEffect that triggers
        //owedNotificatins calculation is triggered
        //so i wouldn't need this => setOwedNotificationsTotal = {setOwedNotificationsTotal}
        //this would be updated in dashboard too => setOwedNotificationsCount = {setOwedNotificationsCount}
        props.getAllSentPaidNotifications(localStorage.getItem('userId'));

        //when props.getAllSentPaidNotifications() is called, 
        //props.allSentPaidNotifications is updated and triggers a useEffect in dashboard that
        //calculates paidNotifications
        //so setPaidBillsTotal = {setPaidBillsTotal} is not needed
    }, [])
    
    //get all notifications when a notifiction is deleted or updated
    useEffect(() => {

        props.getAllSentNotificationsForABill(props.expenseFromDashboard.id);   
        
        props.getAllExpenses(localStorage.getItem('userId'));

    }, [props.deleteSentNotificationSuccess, props.updateNotificationPaidStatusSuccess])
                 
    const deleteNotification = async (e, notificationIn) => {
        console.log("delete notification clicked");

        e.preventDefault();

        try{
            //delete the notification
            await props.deleteSentNotification(notificationIn.id);

            //then get all bills for the user to update state
            //without this the last notification for a bill is not removed until the screen is refreshed
            await props.getAllExpenses(localStorage.getItem('userId'));  

            await props.getAllSentOwedNotifications(localStorage.getItem('userId'));

            await props.getAllSentPaidNotifications(localStorage.getItem('userId')); 

            //reset the all sent notifications for a bill state
            await props.getAllSentNotificationsForABill(props.expenseFromDashboard.id);             

        }catch(err){
            console.error("Delete Notification in ManageNotification.js ERROR", err);
        }  

    }//end deleteNotification   

    const paidHandler = async (event, notificationId) => {
        event.preventDefault();

        let paidStatus = event.target.value;

        try{        

            {event.target.value === "paid" ? paidStatus = true : paidStatus = false}
            console.log("paidStatus", paidStatus);   
            
            await props.updateNotificationPaidStatus(notificationId, {paid: paidStatus});             
           
            await props.getAllExpenses(localStorage.getItem('userId'));  
            
            await props.getAllSentOwedNotifications(localStorage.getItem('userId'));

            await props.getAllSentPaidNotifications(localStorage.getItem('userId')); 

            //get all notifications for the bill from the server
            await props.getAllSentNotificationsForABill(props.expenseFromDashboard.id);          
              
        
        }catch(err){
            console.error("Update Notification in ManageNotification.js ERROR", err);
        }        
        
    }//end paidHandler

    return (

        <div className="manage-notifications">            

            {          

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
            //: null
            }
        </div> 
            
    );
}//end ManageNotifications

const mapStateToProps = state => {
    console.log("notifications in ManageNotifications", state.notificationsReducerIndex.allSentNotifications)
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