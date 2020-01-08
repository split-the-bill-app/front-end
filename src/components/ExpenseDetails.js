import React from "react";

import ExpenseCard from "./ExpenseCard.js";

export default function ExpenseDetails({
                                          expenses, 
                                          setExpenses, 
                                          addExpense, 
                                          editExpense, 
                                          setPaidBillsTotal,
                                          setOwedNotifications,
                                          setOwedNotificationsCount,
                                          setOwedNotificationsTotal                                          

                                    }) {

    
      return (
       /*RENDER USERS TO SCREEN */

       <div className= "expense-list">

            {expenses.map((expense, index) => (

            /*<ExpenseCard key={expense.id} title = {expense.expensetitle} total = {expense.total} 
                         numfriends = {expense.numfriends} name = {expense.name} email = {expense.email}
            />  */
            
            <ExpenseCard              
            setOwedNotificationsTotal = {setOwedNotificationsTotal}
            setOwedNotifications = {setOwedNotifications} 
            setOwedNotificationsCount = {setOwedNotificationsCount}
            setPaidBillsTotal = {setPaidBillsTotal}         
            editExpense={editExpense} 
            addExpense={addExpense} 
            expenses={expenses} 
            setExpenses={setExpenses} 
            expense={expense} 
            key={index} 
            expenseId={expense.id} 
            date={expense.created_at} 
            total={expense.split_sum} 
            numpeople={expense.split_people_count}
            />    
   

       ))}

      </div>

      );     


}
