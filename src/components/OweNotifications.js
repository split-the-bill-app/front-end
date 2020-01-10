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
               
                <p className = "date">
                    {notification.created_at} 
                </p>    
                           
                <p className = "email">{notification.firstname} {notification.lastname} ({notification.email}) </p>
                <p>${notification.split_each_amount} </p>

                {notification.description !== null && notification.description.length > 10 ? (
                        <p className = "description">{notification.description.slice(0, 8)}...</p>
                    ): (
                        <p className = "description">{notification.description}</p>
                    )
                }

                <p> {notification.paid ? "paid" : "unpaid"} </p>                    
            </div>
            })}
        </div> 

    );

}

export default OweNotifications;