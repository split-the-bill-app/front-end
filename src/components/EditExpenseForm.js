import React, {useState, useEffect} from "react";
import axios from "axios";
import {axiosWithAuth} from "../utils/axiosWithAuth.js";

function EditExpenseForm(props) {

  const [expenseToEdit, setExpenseToEdit] = useState({});

  let [counter, setCounter] = useState(0);
  const wordCount = 15;

  useEffect ( () => {

    axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${props.expenseId}`) 
      .then(res => {

        //prepopulates the edit expense form with the expense to edit
        setExpenseToEdit(res.data) 
        console.log("expense to edit", res.data);

      })
      .catch(err => {

        console.log(err.response);

      }) 
    
  }, [])
  

  const handleChange = (event) => {  

    //shows remaining characters in the description field (out of 15)
    if(counter >= 0 && counter <= wordCount){
      setCounter(wordCount - event.target.value.length)
    }    
    
    setExpenseToEdit ({
      ...expenseToEdit, [event.target.name]: event.target.value
    })
    
  }

  const submitHandler = (event) => {
    const split_each_amount = (expenseToEdit.split_sum/expenseToEdit.split_people_count).toFixed(2);   
    console.log("split each amount in edit expense form", split_each_amount);    

    event.preventDefault();

    axiosWithAuth().put(`https://split-the-bill-app.herokuapp.com/api/bills/${props.expenseId}`, {...expenseToEdit, split_each_amount: split_each_amount})
    .then(res => {

    //THE SERVER RETURNS THE ENTIRE LIST OF BILLS WHEN THE APP LOADS OR THE SCREEN IS REFRESHED 
    //SO WHEN CALCULATE IS CLICKED ON THE EDIT EXPENSE FORM YOU COULD REFRESH THE SCREEN
    //BY NOT USING event.preventDefault() OR USE THE editExpense FUNCTION AND THE UPDATED BILL WILL BE DISPLAYED. 
    //AFTER A BILL IS EDITED THE SERVER RETURNS A SUCCESS MESSAGE AND NOT ACTUAL DATA

     props.editExpense({...expenseToEdit, split_each_amount: split_each_amount});
     
     //server actually returns a success message and not the edited expense     
     console.log("edited expense returned from server", res);     

     window.location.reload(true);

    })
    .catch(err => {
      console.log("edit error", err);
    })
  }

  return(

    <div className = "expense-form-div">  

        <form onSubmit = {submitHandler} className = "expense-form">   

          <input type = "number" 
                 name="split_sum"  
                 value = {expenseToEdit.split_sum} 
                 placeholder="How much was the bill?"
                 onChange = {handleChange} />

          <input type = "number" 
                 name="split_people_count"  
                 value = {expenseToEdit.split_people_count} 
                 placeholder="How many people are paying?"
                 onChange = {handleChange} />

          <div className = "expense-description">    
            <input type = "text" 
                  className = "form-input-description"
                  name="description"  
                  value = {expenseToEdit.description} 
                  placeholder="What is this for?"
                  maxlength="15"
                  onChange = {handleChange}/>

            <div className = "counter">{counter}/{wordCount}</div>  

          </div>  

          <button type="submit" > Calculate </button>


        </form>            

    </div>

  );
}

export default EditExpenseForm;