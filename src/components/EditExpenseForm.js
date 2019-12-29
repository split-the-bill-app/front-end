import React, {useState, useEffect} from "react";
import axios from "axios";
import {axiosWithAuth} from "../utils/axiosWithAuth.js";

function EditExpenseForm(props) {

  const [expenseToEdit, setExpenseToEdit] = useState({});

  useEffect ( () => {

    axiosWithAuth().get(`https://build-split-the-bill.herokuapp.com/api/bills/${props.expenseId}`) 
      .then(res => {

        setExpenseToEdit(res.data) 
        console.log("expense to edit", res.data);

      })
      .catch(err => {

        console.log(err.response);

      }) 
    
  }, [])

  const handleChange = (event) => {

    setExpenseToEdit ({
      ...expenseToEdit, [event.target.name]: event.target.value
    })
    
  }

  const submitHandler = (event) => {

    event.preventDefault();

    axiosWithAuth().put(`https://build-split-the-bill.herokuapp.com/api/bills/${props.expenseId}`, expenseToEdit)
    .then(res => {

    //THE SERVER RETURNS THE ENTIRE LIST OF BILLS WHEN THE APP LOADS
    //OR THE SCREEN IS REFRESHED SO WHEN CALCULATE IS CLICKED ON THE EDIT EXPENSE FORM YOU COULD REFRESH THE SCREEN
    //BY NOT USING event.preventDefault (INSEAD OF USING AN editExpense FUNCTION AND THE UPDATED BILL WILL BE DISPLAYED. AFTER A BILL IS EDITED THE SERVER
    //RETURNS A SUCCESS MESSAGE AND NOT ACTUAL DATA

     props.editExpense(expenseToEdit);
            
      console.log("expense to edit", expenseToEdit);

      //server actually returns a success message and not the edited expense
      console.log("edited expense returned from server", res);
    })
    .catch(err => {
      console.log("edit error", err);
    })


  }


  return(

    <div className = "expense-form-div">  

        <form onSubmit = {submitHandler} className = "expense-form">   

          <input type = "text" 
                 name="split_sum"  
                 value = {expenseToEdit.split_sum} 
                 placeholder="How much was the bill?"
                 onChange = {handleChange} />

          <input type = "text" 
                 name="split_people_count"  
                 value = {expenseToEdit.split_people_count} 
                 placeholder="How many people are paying?"
                 onChange = {handleChange} />

          <button type="submit" > Calculate </button>


        </form>            

    </div>

  );
}

export default EditExpenseForm;