import React, {useState, useEffect} from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";
import { Icon, Card, Modal } from "semantic-ui-react";

function ManageNotifications(props){    

    console.log("props in manage notifs", props.notifications);

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
        .then( () => {            
            axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${props.notifications[0].bill_id}/notifications`)
            .then(res => {
                console.log("notifications after delete", res.data);               

            })       
            .catch(err => {
                console.log("get notifications status after delete", err.response);                
                
            })  
        
        })

    }

    const paidHandler = (event) => {
        event.preventDefault();

        paidStatus = event.target.value;

        console.log("event.target.value", event.target.value);  

        {event.target.value === "paid" ? paidStatus = true : paidStatus = false}
        console.log("paidStatus", paidStatus); 

        axiosWithAuth().put(`https://split-the-bill-app.herokuapp.com/api/notifications/${props.notifications[0].id}`, {paid: paidStatus})
        .then(res => { 
                 
         //server actually returns a success message and not the edited expense
         console.log("edited expense returned from server", res.data);

         //page is refreshed and updated payment status is reflected after modal is closed 
         //because notifications is added to the dependency array in ExpenseCard.js

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
                        type="select"
                        name="payment"    
                        onChange={paidHandler}
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