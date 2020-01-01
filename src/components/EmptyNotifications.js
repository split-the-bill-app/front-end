import React from "react";

function EmptyNotifications(){

    console.log("props in empty notifs")

    return (

        <div className="empty-notifications">
            <p>You haven't sent any notifications yet.</p>
        </div>  
    );

}

export default EmptyNotifications;