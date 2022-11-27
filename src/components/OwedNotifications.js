import React from "react";

//bills that your friends owe you
function OwedNotifications(props){  
      
    return (
        <div className="manage-notifications">
            {props.owedNotifications.map((notification, index) => {
            return <div className="notification" key={index}>               
                <p className = "date">
                    {notification.created_at} 
                </p>                            
                
                {notification.email !== null && notification.email.length > 10 ? (
                        <p className = "email">{notification.email.slice(0, 13)}...</p>
                    ): (
                        <p className = "email">{notification.email}</p>
                    )
                }
                    
                <p>${notification.split_each_amount} </p>
                <p className = "description">{notification.description}</p>                               
                <p> {notification.paid ? "paid" : "unpaid"} </p>                    
            </div>
            })}
        </div>
    );
}

export default OwedNotifications;