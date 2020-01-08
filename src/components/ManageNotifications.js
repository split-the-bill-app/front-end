import React, {useState, useEffect} from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";
import { Icon, Card, Modal } from "semantic-ui-react";

function ManageNotifications(props){    

    //console.log("props in manage notifs", props.notifications);
    //const [notificationToEdit, setNotificationToEdit] = useState({});

    useEffect( () => {
         
         
            //get all notifications/bills sent by the user (your friends owe you) and set them to state owedNotifications
            axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/notifications/owed/${localStorage.getItem('userId')}`)
            .then(res => {           
                console.log("friends owe you returned from server ManageNotifiations.js", res.data);
                props.setOwedNotifications(res.data);            

                let owedTotal = 0;

                res.data.forEach(notification => {
                    return owedTotal += notification.split_each_amount;
                })

                console.log("friends owe you total ManageNotifications.js", owedTotal);
                props.setOwedNotificationsCount(res.data.length);
                props.setOwedNotificationsTotal(owedTotal);

                
            })
            .catch(err => {
                console.log("get all notifications/bills your friends owe you error ManageNotifications.js", err.response);

                // then get all bills for the user and set them to state "expenses"
           
                         
            })

            //get all paid bills your friends owe you and call props.setPaidBillsTotal
            axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/notifications/paid/${localStorage.getItem('userId')}`)
            .then(res => {           
                console.log("paid bills friends owe you returned from server in ManageNotifications.js", res.data);
                
                let paidTotal = 0;

                res.data.forEach(paidBill => {
                    return paidTotal += paidBill.split_each_amount;
                })

                console.log("paid bills friends owe you total ManageNotifications.js", paidTotal);             
                props.setPaidBillsTotal(paidTotal);
            })
            .catch(err => {
                console.log("paid bills friends owe you total error ManageNotifications.js", err.response);
               
            }) 

            /*axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/users/${localStorage.getItem('userId')}/bills`)
            .then(res => {
                //console.log(res);
                props.setExpenses(res.data);
                console.log("list of bills for the user ManageNotifications.js", res.data);
            })
            .catch(err => {
                console.log("get all bills for uer error ManageNotifications.js", err);
            })*/         
    }, [props.notifications])

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
        .catch(err => {
            console.log("delete notification error", err.response);
        })       

    }    

    const paidHandler = async (event, notificationId) => {
        event.preventDefault();

        paidStatus = event.target.value;

        console.log("event.target.value", event.target.value);  
        console.log("notificationId", notificationId); 

        {event.target.value === "paid" ? paidStatus = true : paidStatus = false}
        console.log("paidStatus", paidStatus);              

         axiosWithAuth().put(`https://split-the-bill-app.herokuapp.com/api/notifications/${notificationId}`, {paid: paidStatus})
        .then(res => { 
                         
            //server actually returns a success message and not the edited expense
            console.log("edited notification response returned from server", res.data);                      
           
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