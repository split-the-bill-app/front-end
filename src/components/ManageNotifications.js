import React from "react";

function ManageNotifications(props){

    console.log("props in manage notifs", props)

    return (

        <div className="manage-notifications">
            {props.notifications.map((notification, index) => {
            return <div className="notification" key={index}>
                <p className = "email">{notification.email} </p>
                <p>${notification.split_each_amount} </p>
                <p>{notification.description} </p>
                <p>{notification.paid ? "paid" : "not paid"} </p>
            </div>
            })}
        </div>  
    );

}

export default ManageNotifications;