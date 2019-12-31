import React from "react";

function ManageNotifications(props){

    return (

        <div className="manage-notifications">
            {props.notifications.map(
            (notification, index) => <p className="notification" key={index}>{notification.email}</p>)}
        </div>  
    );

}

export default ManageNotifications;