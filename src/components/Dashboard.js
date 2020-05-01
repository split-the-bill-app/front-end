import React, { useState, useEffect } from 'react';
import { Button, Modal, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { 
        getUserDetails,
        getAllSentOwedNotifications, 
        getAllSentPaidNotifications,        
        getReceivedNotifications,
        getAllExpenses,
        addNewExpense,
        logoutUser
 } from "../redux_store/actions";
import Badge from '@material-ui/core/Badge';
import 'semantic-ui-css/semantic.css'; 
import 'semantic-ui-css/semantic.min.css';
import AddExpenseForm from "./AddExpenseForm";
import ExpenseDetails from "./ExpenseDetails.js";
import OweNotifications from "./OweNotifications.js";
import OwedNotifications from "./OwedNotifications.js";

//popup/tooltip style
const style = {    
    opacity: 0.7    
}

function Dashboard (props) {        
    
    //keeps track of the total $amount all the bills your friends have paid
    const [paidBillsTotal, setPaidBillsTotal] = useState([]);    
    //keeps track of the number of notifications/bills you owe your friends
    const [oweNotificationsCount, setOweNotificationsCount] = useState(0);
    //keeps track of the dollar amount of notifications/bills you owe your friends
    const [oweNotificationsTotal, setOweNotificationsTotal] = useState(0);
    //keeps track of the number of notifications/bills your friends owe you
    const [owedNotificationsCount, setOwedNotificationsCount] = useState(0);    
    //keeps track of the dollar amount of notifications/bills your friends owe you
    const [owedNotificationsTotal, setOwedNotificationsTotal] = useState(0);    

    //calculates how much your friends owe you    
    let owedGrandTotal = 0;
    let eachPersonBill = 0;
    let owedForEachBill = 0;
    let owedForEachBillTotal = 0;

    if (props.allExpenses && props.allExpenses.length > 0) {
        props.allExpenses.forEach( expense => {              
            eachPersonBill = (expense.split_sum / expense.split_people_count) 
            owedForEachBill = expense.split_sum - eachPersonBill //subtract bill creator's portion
    
            owedForEachBillTotal += owedForEachBill

        });
       
        owedGrandTotal = owedForEachBillTotal.toFixed(2);       
    }//end if

    const yourFriendsOweYou = owedGrandTotal - paidBillsTotal;

    /*console.log("paidBillsTotal", paidBillsTotal);
    console.log("owedGrandTotal", owedGrandTotal);
    console.log("your friends owe you", yourFriendsOweYou);*/    

    useEffect(() => {
        //get user details
        props.getUserDetails(localStorage.getItem('userId'));  
        
        // then get all bills for the user
        props.getAllExpenses(localStorage.getItem('userId'));        
        
        //then get all notifications sent to the user (you owe your friends)
        props.getReceivedNotifications(localStorage.getItem('userEmail'));       

        //get all notifications/bills sent by the user (your friends owe you)
        props.getAllSentOwedNotifications(localStorage.getItem('userId'));

        //get all paid bills your friends owe you and set them to state paidBills
        props.getAllSentPaidNotifications(localStorage.getItem('userId'));       

    }, []) 

    //continuously check for received notifications
    useEffect(() => {
        //then get all notifications sent to the user (you owe your friends)
        props.getReceivedNotifications(localStorage.getItem('userEmail'));
    })
    
    //get all expenses when a bill is added, updated, or deleted
    useEffect(() => {

        props.getAllExpenses(localStorage.getItem('userId'));

    }, [props.addedExpenseSuccess, props.editExpenseSuccess, props.deleteExpenseSuccess])

    useEffect(() => {

       //get all notifications/bills sent by the user (your friends owe you)
       props.getAllSentOwedNotifications(localStorage.getItem('userId'));

    }, [props.deleteSentNotificationSuccess, props.updateNotificationPaidStatusSuccess])

    //when all notifications that you owe your friends are received
    useEffect(() => {
        if(props.allReceivedNotifications){

            //all notifications that were sent to you where paid status === false
            const unpaidNotifications = props.allReceivedNotifications.filter(notification => {
                return notification.paid === false
            })

            let unpaidTotal = 0;

            unpaidNotifications.forEach(notification => {
                return unpaidTotal += notification.split_each_amount;
            }) 
            
            setOweNotificationsCount(unpaidNotifications.length);
            setOweNotificationsTotal(unpaidTotal);
        }

    }, [props.allReceivedNotifications])

    //when all unpaid notifications/bill you sent to your friends are returned from the server
    useEffect(() => {
        let owedTotal = 0;

        if(props.allSentOwedNotifications){

             //iterate over all sent owed notifications and calclate owedTotal
             props.allSentOwedNotifications.forEach(notification => {
                return owedTotal += notification.split_each_amount;
            })
        }       
                  
        setOwedNotificationsCount(props.allSentOwedNotifications.length);
        setOwedNotificationsTotal(owedTotal);        

    }, [
        props.allSentOwedNotifications, //re-calculate owedTotals every time a notification is sent
        owedNotificationsCount, 
        owedNotificationsTotal         
    ])

    useEffect(() => {
        let paidTotal = 0;

        if(props.getAllSentPaidNotifications){
            //iterate over all sent owed notifications and calclate owedTotal
            props.allSentPaidNotifications.forEach(paidBill => {
                return paidTotal += paidBill.split_each_amount;
            })

            setPaidBillsTotal(paidTotal);
        }

        if(props.allSentPaidNotifications){          
            setPaidBillsTotal(paidTotal);

        }

    }, [props.getAllSentPaidNotifications])   

    // fire on logout button, clears token and pushes user back to login page
    const logoutHandler = (e) => {
        e.preventDefault();
        props.logoutUser();        
        localStorage.clear();
        props.history.push('/');
    }

    return (

        /*main container for the dashboard elements */
        <div className = "dashboard-container">
            {/* logo and log out button */}
            <div className = "navbar">                 
               
            </div>

            {/* dashboard*/}
            <div className = "dashboard-div">

                {/* dashboard*/}
                <div className = "dashboard-header-div">

                    <Modal trigger = {

                    <Button>Add Expense</Button>               
                    } closeIcon>

                    <Modal.Header>Add Expense</Modal.Header>

                    <AddExpenseForm /*addExpense = {addExpense}*//>                                     

                    </Modal>                  

                        <h1>Hi {props.user.firstname}!</h1>

                    <Button onClick={logoutHandler}> Log Out </Button>                  
                           
                </div>
                
                {/* DISPLAYS THE OWED AND OWES RUNNING TOTALS */}
                <div className="totals-summary-div">

                    {console.log("oweNotificationsCount in render", oweNotificationsCount)} 
                    {console.log("owedNotificationsCount in render", owedNotificationsCount)}                                        

                    {/* DISPLAYS WHAT YOU OWE */}
                    <Modal trigger = {                        
                        <Badge className = "owe-badge" badgeContent={oweNotificationsCount > 0 ? oweNotificationsCount: "0"} color="primary">
                            <Popup content='Click to View Received Notifications' position= 'bottom center' style={style} inverted trigger={
                            <div className = "owe-div">                      

                                You Owe Your Friends
                                <p className = "owedTotal"> {oweNotificationsTotal > 0 ? `$${oweNotificationsTotal.toFixed(2)}` : "$0"} </p> {/* update the totals here */}
                            </div>  
                            } /> {/*end popup */}  
                        </Badge>           
                        
                    } closeIcon>

                        <Modal.Header>View Received Notifications</Modal.Header>

                        <Modal.Content image scrolling> 

                        {props.allReceivedNotifications.length > 0 ?

                        <OweNotifications oweNotifications = {props.allReceivedNotifications} />
                        :
                        <p>You have no outstanding notifications.</p> 

                        }                            

                        </Modal.Content>                            

                    </Modal>

                    {/* DISPLAYS WHAT YOU ARE OWED */}    
                    <Modal trigger = {                           
                                     
                        <Badge className = "owed-badge" badgeContent={owedNotificationsCount > 0 ? owedNotificationsCount: "0"} color="primary">
                            <Popup content='Click to View Sent Notifications' position= 'bottom center' style={style} inverted trigger={
                            <div className = "owed-div">                    
                                Your Friends Owe You
                                {/*<p className = "owedTotal"> ${owedTotal} </p>*/}
                                <p className = "owedTotal"> {yourFriendsOweYou > 0 ? `$${yourFriendsOweYou.toFixed(2)}` : "$0"}  </p> {/* update the totals here */}

                            </div>
                            } /> {/*end popup*/}
                        </Badge>
                       
                    } closeIcon>

                        <Modal.Header>View Sent Notifications</Modal.Header>

                        <Modal.Content image scrolling> 

                        {props.allSentOwedNotifications.length > 0 ?

                        <OwedNotifications owedNotifications = {props.allSentOwedNotifications} />
                        :
                        <p>Your friends have no outstanding notifications.</p> 

                        }                            

                        </Modal.Content>   

                    </Modal>
                </div>
                
                {/* LIST OF BILLS HISTORY */}
                <div className = "bills-list-div">                   
                    {
                        (props.allExpenses && props.allExpenses.length > 0) ? 
                        <ExpenseDetails                            
                            expensesFromDashboard = {props.allExpenses} //all expenses for the user                           
                            setPaidBillsTotal = {setPaidBillsTotal}                        
                            setOwedNotificationsTotal = {setOwedNotificationsTotal}
                            setOwedNotificationsCount = {setOwedNotificationsCount}                            
                        />
                        : 
                        <Modal trigger = {

                            <Button>Add An Expense To Start Splitting</Button>               
                            } closeIcon>
    
                            <Modal.Header>Add an Expense</Modal.Header>
    
                            <AddExpenseForm /*addExpense = {addExpense}*/ />                                     
               
                        </Modal>
                    }                    
                    
                </div>  {/*end bills-list-div */}

            </div> {/*end dashboard div */}
        
        </div> /*end container div */
    
    );//end return

}//end function

const mapStateToProps = state => {    
    return {
        //user details
        userId: state.usersReducerIndex.userId,
        token: state.usersReducerIndex.token,
        user: state.usersReducerIndex.user,        
        isGettingUserDetails: state.usersReducerIndex.isGettingUserDetails,       
        //expenses
        getAllExpensesError: state.expensesReducerIndex.getAllExpensesError,
        isGettingAllExpenses: state.expensesReducerIndex.isGettingAllExpenses,
        allExpenses: state.expensesReducerIndex.allExpenses,
        getAllExpensesSuccess: state.expensesReducerIndex.getAllExpensesSuccess,
        //edit expense
        editExpenseSuccess: state.expensesReducerIndex.editExpenseSuccess,
        //add expense
        addedExpenseSuccess: state.expensesReducerIndex.addedExpenseSuccess,
        //delete a bill
        deleteExpenseError: state.expensesReducerIndex.deleteExpenseError,
        isDeletingExpense: state.expensesReducerIndex.isDeletingExpense,
        deleteExpenseSuccess: state.expensesReducerIndex.deleteExpenseSuccess,
        deleteExpenseConfirmation: state.expensesReducerIndex.deleteExpenseConfirmation,
        //delete all notifications for a single bill
        deleteAllBillNotificationsError: state.notificationsReducerIndex.deleteAllBillNotificationsError, 
        isDeletingAllBillNotifications: state.notificationsReducerIndex.isDeletingAllBillNotifications,
        deleteAllBillNotificationsSuccess: state.notificationsReducerIndex.deleteAllBillNotificationsSuccess,
        deleteAllBillNotificationsConfirmation: state.notificationsReducerIndex.deleteAllBillNotificationsConfirmation,
        //your friends owe you
        getAllSentOwedNotificationsError: state.notificationsReducerIndex.getAllSentOwedNotificationsError,
        isGettingAllSentOwedNotifications: state.notificationsReducerIndex.isGettingAllSentOwedNotifications,
        getAllSentOwedNotificationsSuccess: state.notificationsReducerIndex.getAllSentOwedNotificationsSuccess,
        allSentOwedNotifications: state.notificationsReducerIndex.allSentOwedNotifications,
        //your friends paid what they owe you
        getAllSentPaidNotificationsError: state.notificationsReducerIndex.getAllSentPaidNotificationsError,
        isGettingAllSentPaidNotifications: state.notificationsReducerIndex.isGettingAllSentPaidNotifications,
        getAllSentPaidNotificationsSuccess: state.notificationsReducerIndex.getAllSentPaidNotificationsSuccess,
        allSentPaidNotifications: state.notificationsReducerIndex.allSentPaidNotifications,
        //you owe your friends       
        getAllReceivedNotificationsSuccess: state.notificationsReducerIndex.getAllReceivedNotificationsSuccess,
        allReceivedNotifications: state.notificationsReducerIndex.allReceivedNotifications,        
        //log out
        loggedOut: state.usersReducerIndex.loggedOut,
        //delete individual sent notifications
        deleteSentNotificationError: state.notificationsReducerIndex.deleteSentNotificationError, 
        isDeletingSentNotification: state.notificationsReducerIndex.isDeletingSentNotification,
        deleteSentNotificationSuccess: state.notificationsReducerIndex.deleteSentNotificationSuccess,
        deleteSentNotificationConfirmation: state.notificationsReducerIndex.deleteSentNotificationConfirmation,
        //update a notification from paid to unpaid or unpaid to paid
        updateNotificationPaidStatusError: state.notificationsReducerIndex.updateNotificationPaidStatusError, 
        isUpdatingNotificationPaidStatus: state.notificationsReducerIndex.isUpdatingNotificationPaidStatus,
        updateNotificationPaidStatusSuccess: state.notificationsReducerIndex.updateNotificationPaidStatusSuccess,
        updateNotificationPaidStatusConfirmation: state.notificationsReducerIndex.updateNotificationPaidStatusConfirmation 
    }
}

export default connect(
    mapStateToProps, 
    {
        getUserDetails,
        getAllSentOwedNotifications, 
        getAllSentPaidNotifications,        
        getReceivedNotifications,
        getAllExpenses,
        addNewExpense,
        logoutUser
    })(Dashboard);

