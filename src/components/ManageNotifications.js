import React, {useState, useEffect} from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";
import { Icon, Card, Modal } from "semantic-ui-react";

function ManageNotifications(props){    

    //console.log("props in manage notifs", props.notifications);
    //const [notificationToEdit, setNotificationToEdit] = useState({});

    let paidStatus = "";      
   
    const deleteNotification = (e, notificationIn) => {
        console.log("delete notification clicked");

        e.preventDefault();

        axiosWithAuth().delete(`https://split-the-bill-app.herokuapp.com/api/notifications/${notificationIn.id}`)
        .then(res => { 
                 
         //server actually returns a success message and not the edited expense
         console.log("deleted expense response returned from server", res.data);
         
         //call props.setNotifications in ExpenseCard.js and removes/filters out the notification that was just deleted
         props.setNotifications(props.notifications.filter(notification => notification.id !== notificationIn.id))

        })        

    }

    /*const updateNotification = (updatedNotification) => {

        console.log("updated notification in updateNotifaction", updatedNotification);
       
        //create an array called expensesCopy and spread in the contents of the expenses array
        const notificationsCopy = [...props.notifications];
        
        //find the index in the notificationsCopy array where the id of the notificatiion at that index is equal 
        //to the id of the notification passed down from the editExpenseForm (submitHandler function) 
        const notificationIndex = notificationsCopy.findIndex(notification => notification.id === updatedNotification.id);
    
        //when a match is found, replace the notification at the matched index with the notification passed down 
        //(updatedNotification) from ManageNotifications.js
        notificationsCopy[notificationIndex] = updatedNotification;
        
        //after making the switch, replace the notifications array with the notificationsCopy array 
        props.setNotifications (notificationsCopy);

        console.log("notifications copy", notificationsCopy);

        console.log("update notification method", props.notifications);
    }*/  

    const paidHandler = (event, notificationId) => {
        event.preventDefault();

        paidStatus = event.target.value;

        console.log("event.target.value", event.target.value);  
        console.log("notificationId", notificationId); 

        {event.target.value === "paid" ? paidStatus = true : paidStatus = false}
        console.log("paidStatus", paidStatus);  
        
        /*setNotificationToEdit ({
            ...notificationToEdit, 
                id: notificationId,
                paid: paidStatus
        })*/

        axiosWithAuth().put(`https://split-the-bill-app.herokuapp.com/api/notifications/${notificationId}`, {paid: paidStatus})
        .then(res => { 
                         
         //server actually returns a success message and not the edited expense
         console.log("edited expense returned from server", res.data);

         //page is refreshed and updated payment status is reflected after modal is closed 
         //because notifications is added to the dependency array in ExpenseCard.js
         //call props.setNotifications in ExpenseCard.js and removes/filters out the notification that was just deleted
         
         //updateNotification(notificationToEdit);

         //console.log("notification to edit", notificationToEdit);
        })  
        
        
    }   

    return (

        <div className="manage-notifications">            

            {props.notifications.map((notification, index) => {
            return <div className="notification" key={index}>
                <Icon onClick={(e) => deleteNotification(e, notification)} className = "delete-notification-icon" name='delete' />
                <p className = "email">{notification.email} </p>
                <p>${notification.split_each_amount} </p>
                <p>{notification.description} </p>
                <p>
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
            </div>
            })}
        </div> 

    );

}

export default ManageNotifications;