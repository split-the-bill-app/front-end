import React from "react";
import ExpenseCard from "./ExpenseCard.js";

export default function ExpenseDetails({ expensesFromDashboard }) {    
      return (
            <div className= "expense-list">
                  {expensesFromDashboard.map((expenseFromDashboard, index) => (                
                        <ExpenseCard                                         
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
}
