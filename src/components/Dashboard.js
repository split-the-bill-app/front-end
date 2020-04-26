import React, { useState, useEffect } from 'react';
import { Icon, Button, Modal, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { logoutUser } from '../redux_store/actions';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import 'semantic-ui-css/semantic.css'; 
import 'semantic-ui-css/semantic.min.css'; 

import { axiosWithAuth } from '../utils/axiosWithAuth';

import AddExpenseForm from "./AddExpenseForm";
import ExpenseDetails from "./ExpenseDetails.js";
import OweNotifications from "./OweNotifications.js";
import OwedNotifications from "./OwedNotifications.js";

//popup/tooltip style
const style = {    
    opacity: 0.7    
}

function Dashboard (props) {
    
    //logged in user
    const [user, setUser] = useState({});

    //keeps track of expenses
    const [expenses, setExpenses] = useState([]);
    
    //keeps track of all the bills your friends have paid
    const [paidBills, setPaidBills] = useState([]);

    //keeps track of the total $amount all the bills your friends have paid
    const [paidBillsTotal, setPaidBillsTotal] = useState([]);

    //keeps track of outstanding notifications/bills you owe
    const [oweNotifications, setOweNotifications] = useState([]);

    //keeps track of outstanding notifications/bills owed to you
    const [owedNotifications, setOwedNotifications] = useState([]);    

    //keeps track of the number of notifications/bills you owe your friends
    const [oweNotificationsCount, setOweNotificationsCount] = useState(0);

    //keeps track of the number of notifications/bills your friends owe you
    const [owedNotificationsCount, setOwedNotificationsCount] = useState(0);

    //keeps track of the dollar amount of notifications/bills you owe your friends
    const [oweNotificationsTotal, setOweNotificationsTotal] = useState(0);

    //keeps track of the dollar amount of notifications/bills your friends owe you
    const [owedNotificationsTotal, setOwedNotificationsTotal] = useState(0);

    

    //calculates how much your friends owe you  
    //THIS IS NOT BEING USED ANYMORE. UNPAID BILLS ARE NOW BEING READ FROM THE SERVER AND CALCULATED
    let owedGrandTotal = 0;
    let eachPersonBill = 0;
    let owedForEachBill = 0;
    let owedForEachBillTotal = 0;

    if (expenses.length > 0) {

        expenses.forEach( expense => {

            ///grandTotal += expense.split_sum;
            //totalPeople += (expense.split_people_count - 1);
            //count = count + 1;  
            
            eachPersonBill = (expense.split_sum / expense.split_people_count) 
            owedForEachBill = expense.split_sum - eachPersonBill //subtract bill creator's portion
    
            owedForEachBillTotal += owedForEachBill

        });
       
        owedGrandTotal = owedForEachBillTotal.toFixed(2);

        //owedTotal = ((grandTotal/totalPeople)*(totalPeople-count)).toFixed(2); 
        //owedTotal = ((grandTotal / totalPeople) * count).toFixed(2);

    }//end if

    const yourFriendsOweYou = owedGrandTotal - paidBillsTotal;

    console.log("paidBillsTotal", paidBillsTotal);
    console.log("owedGrandTotal", owedGrandTotal);
    console.log("your friends owe you", yourFriendsOweYou);

    useEffect(() => {

        //get all notifications/bills sent by the user (your friends owe you) and set them to state owedNotifications
        axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/notifications/owed/${localStorage.getItem('userId')}`)
            .then(res => {           
                //console.log("your friends owe you returned from server", res.data);
                setOwedNotifications(res.data);            

                let owedTotal = 0;

                res.data.forEach(notification => {
                    return owedTotal += notification.split_each_amount;
                })

                //console.log("your friends owe you total", owedTotal);
                setOwedNotificationsCount(res.data.length);
                setOwedNotificationsTotal(owedTotal);
            })
            .catch(err => {
                console.log("get all notifications/bills your friends owe you error Dashboard", err.response);                                                        
            })

        //get all paid bills your friends owe you and set them to state paidBills
        axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/notifications/paid/${localStorage.getItem('userId')}`)
            .then(res => {           
                //console.log("paid bills your friends owe you returned from server", res.data);
                setPaidBills(res.data);            
    
                let paidTotal = 0;
    
                res.data.forEach(paidBill => {
                    return paidTotal += paidBill.split_each_amount;
                })
    
                //console.log("paid bills your friends owe you total", paidTotal);             
                setPaidBillsTotal(paidTotal);
            })
            .catch(err => {
                console.log("paid bills your friends owe you total error Dashboard", err.response);                
                         
            })   

    }, [])    

    useEffect(() => {
        // get user details and set them to state "user"
        axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/users/${localStorage.getItem('userId')}`)
            .then(res => {
                //console.log("user object when the app loads", res);
                setUser(res.data);
                //console.log("user object when the app loads => user", user);

                // then get all notifications sent to the user (you owe your friends) and set them to state oweNotifications
                axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/notifications/${res.data.email}`)
                .then(res => {
                    //console.log(res);
                    setOweNotifications(res.data);
                    const unpaidNotifications = res.data.filter(notification => {
                        return notification.paid === false
                    })

                    let unpaidTotal = 0;

                    unpaidNotifications.forEach(notification => {
                        return unpaidTotal += notification.split_each_amount;
                    })

                    //console.log("unpaid notifications total", unpaidTotal);
                    setOweNotificationsCount(unpaidNotifications.length);
                    setOweNotificationsTotal(unpaidTotal);
                })
                .catch(err => {
                    //console.log("get all notifications/bills you owe your friends error", err.response);
                })
                
        })//end then
        .catch(err => {
            console.log("get logged in user details error", err);
        })       

        // then get all bills for the user and set them to state "expenses"
        axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/users/${localStorage.getItem('userId')}/bills`)
            .then(res => {
                //console.log(res);
                setExpenses(res.data);
                console.log("list of bills for the user when the app loads", res.data);
            })
            .catch(err => {
                //console.log("get all bills for uer error", err);
            })
    
    }, [])
    // console.log(user);   

    //adds an expense to the expenses array when the calculate button on the add expense form is clicked
    const addExpense = (expense) => {
        setExpenses([...expenses, expense]);
        console.log("add expense when calculate button is clicked on add expense form", expense)
    }

    //THE SERVER RETURNS THE ENTIRE LIST OF BILLS WHEN THE APP LOADS
    //OR THE SCREEN IS REFRESHED SO WHEN CALCULATE IS CLICKED ON THE EDIT EXPENSE FORM YOU COULD REFRESH THE SCREEN
    //BY NOT USING event.preventDefault (INSEAD OF USING AN editExpense FUNCTION AND THE UPDATED BILL WILL 
    //BE DISPLAYED. AFTER A BILL IS EDITED THE SERVER
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

                    <AddExpenseForm addExpense = {addExpense}/>                                     

                    </Modal>                  

                        <h1>Hi {user.firstname}!</h1>

                    <Button onClick={logoutHandler}> Log Out </Button>                  
                           
                </div>
                
                {/* DISPLAYS THE OWED AND OWES RUNNING TOTALS */}
                <div className="totals-summary-div">

                    {console.log("oweNotificationsCount in render", oweNotificationsCount)}
                    {console.log("oweNotifications in render", oweNotifications)}

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

                        {oweNotifications.length > 0 ?

                        <OweNotifications oweNotifications = {oweNotifications} />
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

                        {owedNotifications.length > 0 ?

                        <OwedNotifications owedNotifications = {owedNotifications} />
                        :
                        <p>Your friends have no outstanding notifications.</p> 

                        }                            

                        </Modal.Content>   

                    </Modal>
                </div>
                
                {/* LIST OF BILLS HISTORY */}
                <div className = "bills-list-div">  
                   
                    {
                        expenses.length > 0 ? 
                        <ExpenseDetails 
                            setExpenses={setExpenses} 
                            expenses = {expenses} 
                            addExpense = {addExpense} 
                            editExpense = {editExpense}
                            setPaidBillsTotal = {setPaidBillsTotal}
                            setOwedNotifications = {setOwedNotifications}
                            setOwedNotificationsTotal = {setOwedNotificationsTotal}
                            setOwedNotificationsCount = {setOwedNotificationsCount}                            
                        /> 

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

const mapStateToProps = state => {
    return {
        loggedOut: state.usersReducerIndex.loggedOut
    }
}

export default connect(mapStateToProps, {logoutUser})(Dashboard);

