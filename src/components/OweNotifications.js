import React, {useState, useEffect} from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";
import { Icon, Card, Modal } from "semantic-ui-react";
import Moment from 'react-moment';

//bills that you need to pay
function OweNotifications(props){       

    return (

        <div className="manage-notifications">            

            {props.oweNotifications.map((notification, index) => {
            return <div className="notification" key={index}> 
                <Moment format="MM/DD/YYYY">
                <p className = "email">
                    {notification.created_at} 
                </p>    
                </Moment>           
                <p className = "email">{notification.firstname} {notification.lastname} ({notification.email}) </p>
                <p>${notification.split_each_amount} </p>
                <p>{notification.description} </p>                
                <p> {notification.paid ? "paid" : "unpaid"} </p>                    
            </div>
            })}
        </div> 

    );

}

export default OweNotifications;