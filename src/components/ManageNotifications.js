import React, {useState, useEffect} from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";

function ManageNotifications(props){    

    console.log("props in manage notifs", props.notifications);

    let paidStatus = "";

    //let notifications = [];   

    //console.log("notifications at the start of manage notifs", notifications);

    const paidHandler = (event) => {
        event.preventDefault();

        paidStatus = event.target.value;

        console.log("event.target.value", event.target.value);  

        {event.target.value === "paid" ? paidStatus = true : paidStatus = false}
        console.log("paidStatus", paidStatus); 

        axiosWithAuth().put(`https://split-the-bill-app.herokuapp.com/api/notifications/${props.notifications[0].id}`, {paid: paidStatus})
        .then(res => { 
                 
         //server actually returns a success message and not the edited expense
         console.log("edited expense returned from server", res);

        })
        /*.then( () => {

            //either have the server return the edited notification
            //or use a props.editedNotification function
            //props.editExpense({...expenseToEdit, split_each_amount: split_each_amount});
            axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${props.notifications[0].bill_id}/notifications`)
            .then(res => {
                console.log("notifications after update", res.data);
                notifications = res.data;
                console.log("new notifications after update", res.data);
                console.log("new notifications after update", notifications);
            })       
            .catch(err => {
            console.log("edit error", err);
            }) 
        
        })*/
        
    }   

    return (

        //notifications.length > 0 ? 

        /*<div className="manage-notifications">
            {notifications.map((notification, index) => {
            return <div className="notification" key={index}>
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
        </div>  */

        //:

        <div className="manage-notifications">
            {props.notifications.map((notification, index) => {
            return <div className="notification" key={index}>
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