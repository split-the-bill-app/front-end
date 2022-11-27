import React from "react";

//bills that you need to pay
function OweNotifications(props){       

    return (
        <div className="manage-notifications">
            {props.oweNotifications.map((notification, index) => {
            return <div className="notification" key={index}>                
                <p className = "date">
                    {notification.created_at} 
                </p>    
                           
                <p className = "email">{notification.firstname} {notification.lastname} ({notification.email}) </p>
                <p>${notification.split_each_amount} </p>               
                <p className = "description">{notification.description}</p>
                <p> {notification.paid ? "paid" : "unpaid"} </p>                    
            </div>
            })}
        </div> 
    );
}

export default OweNotifications;