import React from "react";
import ExpenseCard from "./ExpenseCard.js";

export default function ExpenseDetails({
                                          expensesFromDashboard, 
                                          //getAllExpensesFromDashboard,                                          
                                          setPaidBillsTotal,                                          
                                          setOwedNotificationsCount,
                                          setOwedNotificationsTotal                                          

                                    }) {
    
      return (      

       <div className= "expense-list">

            {expensesFromDashboard.map((expenseFromDashboard, index) => (           
            
                  <ExpenseCard              
                        setOwedNotificationsTotal = {setOwedNotificationsTotal}                        
                        setOwedNotificationsCount = {setOwedNotificationsCount}
                        setPaidBillsTotal = {setPaidBillsTotal}   
                        //call props.getAllExpenses() in the components that need it instead of passing this down                    
                        //getAllExpensesFromDashboard={getAllExpensesFromDashboard} 
                        expenseFromDashboard = {expenseFromDashboard} 
                        key={index} 
                        expenseId = {expenseFromDashboard.id} 
                        date={expenseFromDashboard.created_at} 
                        total={expenseFromDashboard.split_sum} 
                        numPeople={expenseFromDashboard.split_people_count}
                  />   

       ))}

      </div>

      );

}//end ExpenseDetails
