import React, { useState, useEffect } from 'react';
import { Icon, Button, Modal } from 'semantic-ui-react';
import Badge from '@material-ui/core/Badge';
import 'semantic-ui-css/semantic.css'; 
import 'semantic-ui-css/semantic.min.css'; 

import { axiosWithAuth } from '../utils/axiosWithAuth';

import AddExpenseForm from "./AddExpenseForm";
import ExpenseDetails from "./ExpenseDetails.js";
import OweNotifications from "./OweNotifications.js";

export default function Dashboard (props) {

    //let owedNotificationsCount = 0;

    //logged in user
    const [user, setUser] = useState({});

    //keeps track of expenses
    const [expenses, setExpenses] = useState([]);

    //keeps track of outstanding notifications
    const [oweNotifications, setOweNotifications] = useState([]);

    //keeps track of the number of outstanding notifications
    const [oweNotificationsCount, setOweNotificationsCount] = useState(0);

    //keeps track of the dollar amount of outstanding notifications
    const [oweNotificationsTotal, setOweNotificationsTotal] = useState(0);

    //calculates how much your friends owe you   
    let owedTotal = 0;
    let eachPersonBill = 0;
    let owedForEachBill = 0;
    let owedForEachBillTotal = 0;

    if (expenses.length > 0) {

        expenses.forEach( expense => {

            /*grandTotal += expense.split_sum;
            totalPeople += (expense.split_people_count - 1);
            count = count + 1; */   
            
            eachPersonBill = (expense.split_sum / expense.split_people_count) 
            owedForEachBill = expense.split_sum - eachPersonBill
    
            owedForEachBillTotal += owedForEachBill

        });
       
        owedTotal = owedForEachBillTotal.toFixed(2);

        //owedTotal = ((grandTotal/totalPeople)*(totalPeople-count)).toFixed(2); 
        //owedTotal = ((grandTotal / totalPeople) * count).toFixed(2);

    }//end if

    useEffect(() => {
        // get user details and set them to state "user"
        axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/users/${localStorage.getItem('userId')}`)
            .then(res => {
                console.log("user object when the app loads", res);
                setUser(res.data);
                console.log("user object when the app loads => user", user);

                // then get all notifications for the user and set them to state oweNotifications
                axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/notifications/${res.data.email}`)
                .then(res => {
                    console.log(res);
                    setOweNotifications(res.data);
                    const unpaidNotifications = res.data.filter(notification => {
                        return notification.paid === false
                    })

                    let unpaidTotal = 0;

                    unpaidNotifications.forEach(notification => {
                        return unpaidTotal += notification.split_each_amount;
                    })

                    console.log("unpaid notifications total", unpaidTotal);
                    setOweNotificationsCount(unpaidNotifications.length);
                    setOweNotificationsTotal(unpaidTotal);
                })
                .catch(err => {
                    console.log("get all notifications for a user error", err);
                })
            })
            .catch(err => {
                console.log("get logged in user details error", err);
            })
        // then get all bills for the user and set them to state "expenses"
        axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/users/${localStorage.getItem('userId')}/bills`)
            .then(res => {
                console.log(res);
                setExpenses(res.data);
                console.log("list of bills for the user when the app loads", res.data);
            })
            .catch(err => {
                console.log("get all bills for uer error", err);
            })
        
    }, [])
    // console.log(user);   

    //adds an expense to the expenses array when the calculate button on the add expense form is clicked
    const addExpense = (expense) => {
        setExpenses([...expenses, expense]);
    }

    //THE SERVER RETURNS THE ENTIRE LIST OF BILLS WHEN THE APP LOADS
    //OR THE SCREEN IS REFRESHED SO WHEN CALCULATE IS CLICKED ON THE EDIT EXPENSE FORM YOU COULD REFRESH THE SCREEN
    //BY NOT USING event.preventDefault (INSEAD OF USING AN editExpense FUNCTION AND THE UPDATED BILL WILL BE DISPLAYED. AFTER A BILL IS EDITED THE SERVER
    //RETURNS A SUCCESS MESSAGE AND NOT ACTUAL DATA

    const editExpense = (editedExpense) => {
       
        //create an array called expensesCopy and spread in the contents of the expenses array
        const expensesCopy = [...expenses];
        
        //find the index in the expensesCopy array where the id of the bill at that index equals to the id of the 
        //bill passed down from the editExpenseForm (submitHandler function) 
        const expenseIndex = expensesCopy.findIndex(expense => expense.id === editedExpense.id);

        //when a match is found, replace the expense at the matched index with the bill passed down (editedExpense)
        //from the EditExpenseForm
        expensesCopy[expenseIndex] = editedExpense;
        
        //after making the switch, replace the expenses array with the expensesCopy array 
        setExpenses (expensesCopy);
    } 
        
    //const initialExpense = expenses.find(expense => expense.id.toString() === props.match.params.id);

    // fire on logout button, clears token and pushes user back to login page
    const logout = (e) => {
        e.preventDefault();
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

                    <AddExpenseForm addExpense = {addExpense}/>                                     

                    </Modal>

                   {/*{  
                    expenses.length > 0 ?
                    <Modal trigger = {

                        <Button>Add Expense</Button>               
                        } closeIcon>

                        <Modal.Header>Add Expense</Modal.Header>

                        <AddExpenseForm addExpense = {addExpense}/>                                     
           
                    </Modal>
                    :
                    null 
                    }*/}

                        <h1>Hi {user.firstname}!</h1>

                    <Button onClick={logout}> Log Out </Button>                  
                           
                </div>
                
                {/* DISPLAYS THE OWED AND OWES RUNNING TOTALS */}
                <div className="totals-summary-div">

                    {console.log("oweNotificationsCount in render", oweNotificationsCount)}
                    {console.log("oweNotifications in render", oweNotifications)}

                    <Modal trigger = {
                        <Badge className = "owe-badge" badgeContent={oweNotificationsCount > 0 ? oweNotificationsCount: "0"} color="primary">
                            <div className = "owe-div">                      

                                You Owe Your Friends
                                <p className = "owedTotal"> {oweNotificationsTotal > 0 ? `$${oweNotificationsTotal}` : "$0"} </p> {/* update the totals here */}
                            </div>    
                        </Badge>           
                
                    } closeIcon>

                    <Modal.Header>View Outstanding Bills</Modal.Header>

                    <Modal.Content image scrolling> 

                    {oweNotifications.length > 0 ?

                     <OweNotifications oweNotifications = {oweNotifications} />
                    :
                    <p>You have no outstanding bills.</p> 

                    }                            

                    </Modal.Content>                            

                    </Modal>
                                        
                    <Badge className = "owed-badge" badgeContent={4} color="primary">
                        <div className = "owed-div">                    
                            Your Friends Owe You
                            <p className = "owedTotal"> ${owedTotal} </p> {/* update the totals here */}

                        </div>
                    </Badge>
                </div>
                
                {/* LIST OF BILLS HISTORY */}
                <div className = "bills-list-div">  
                   
                    {
                        expenses.length > 0 ? 
                        <ExpenseDetails setExpenses={setExpenses} expenses = {expenses} addExpense = {addExpense} editExpense = {editExpense}/> 
                        : 
                        <Modal trigger = {

                            <Button>Add An Expense To Start Splitting</Button>               
                            } closeIcon>
    
                            <Modal.Header>Add an Expense</Modal.Header>
    
                            <AddExpenseForm addExpense = {addExpense} />                                     
               
                        </Modal>
                    }                               
                                   
                    
                </div>  {/*end bills-list-div */}

            </div> {/*end dashboard div */}
        
        </div> /*end container div */
    
    );//end return

}//end function

/************************************TO DISPLAY RECEIVED NOTIFICATIONS***************************/
/*
const [receivedNotifications, setReceivedNotifications] = useState([]);

//put this inside the useEffect()
 axiosWithAuth().get(`https://build-split-the-bill.herokuapp.com/api/notifications`)
            .then(res => {
              console.log("you have notifications", res.data.notifications);
              setReceivedNotifications(res.data.notifications);
            })
            .catch(err => {
              console.log(err);
            })

//put this in the <div className = "navbar">
 <div className = "notifications-received-display">

            <div className = "notification-title">

            <h3>Outstanding Bills</h3>

            </div>

            <div className = "notification-alerts">

            {receivedNotifications.map( (notification, index) => 

            <p className = "alerts">{`${notification.email} `}</p>               

                
            )}

</div>

*/