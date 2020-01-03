import React, {useState, useEffect} from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";
import { Icon, Card, Modal } from "semantic-ui-react";

function OwedNotifications(props){       

    return (

        <div className="manage-notifications">            

            {props.owedNotifications.map((notification, index) => {
            return <div className="notification" key={index}> 
                <p>{notification.created_at} </p>               
                <p className = "email">{notification.firstname} {notification.lastname} ({notification.email}) </p>
                <p>${notification.split_each_amount} </p>
                <p>{notification.description} </p>                
                <p> {notification.paid ? "paid" : "unpaid"} </p>                    
            </div>
            })}
        </div> 

    );

}

export default OwedNotifications;