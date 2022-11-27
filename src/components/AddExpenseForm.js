import React, { useState } from "react";
import { connect } from 'react-redux';
import { addNewExpense, getAllExpenses } from "../redux_store/actions";

function AddExpenseForm(props) {

  const [expenseToAdd, setExpenseToAdd] = useState({});
  let [notesCounter, setNotesCounter] = useState(0);
  let [descCounter, setDescCounter] = useState(0);
  const notesWordCount = 35;
  const descWordCount = 15; 

  const notesCounterHandler = (event) => {
    //shows remaining characters in the notes field (out of 35)
    if(notesCounter >= 0 && notesCounter <= notesWordCount){
      setNotesCounter(notesWordCount - event.target.value.length)
    }
  }

  const descCounterHandler = (event) => {    
    //shows remaining characters in the description field (out of 15)
    if(descCounter >= 0 && descCounter <= descWordCount){
      setDescCounter(descWordCount - event.target.value.length)
    }
  }
    
  const handleChange = (event) => {
    setExpenseToAdd({
      ...expenseToAdd, [event.target.name]: event.target.value
    })
  } 

  const resetForm = () => {
    setExpenseToAdd({...expenseToAdd, 
                    split_sum: "",
                    split_people_count: "",
                    notes: "",
                    description: ""
                  })
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    const split_each_amount = (expenseToAdd.split_sum/expenseToAdd.split_people_count).toFixed(2);       
    await props.addNewExpense({...expenseToAdd, split_each_amount: split_each_amount, user_id: localStorage.getItem('userId')});    
    // then get all bills for the user and update the props.allExpenses state
    await props.getAllExpenses(localStorage.getItem('userId'));   
    resetForm();
  }

  return(

    <div className = "expense-form-div">  
        <form onSubmit = {submitHandler} className = "expense-form">   
          <input type = "number" 
                 className = "form-input"
                 name="split_sum"  
                 value = {expenseToAdd.split_sum} 
                 placeholder="How much was the bill?"
                 onChange = {handleChange} 
                 required/>

          <input type = "number" 
                 className = "form-input"
                 name="split_people_count"  
                 value = {expenseToAdd.split_people_count} 
                 placeholder="How many people are paying?"
                 onChange = {handleChange} 
                 required/>

          <div className = "expense-description">    
            <input type = "text" 
                    className = "form-input-description"
                    name="notes"  
                    value = {expenseToAdd.notes} 
                    placeholder="Notes... only you will be able to see this..."
                    maxLength="35"
                    onInput = {notesCounterHandler}
                    onChange = {handleChange} />

            <div className = "counter">{notesCounter}/{notesWordCount}</div>  
          </div>  

          <div className = "expense-description">    
            <input type = "text" 
                   className = "form-input-description"
                   name="description"  
                   value = {expenseToAdd.description} 
                   placeholder="What is this for?"
                   maxLength="15"
                   onInput = {descCounterHandler}
                   onChange = {handleChange} />

            <div className = "counter">{descCounter}/{descWordCount}</div> 
          </div>  

          <button type="submit" > Add </button>
        </form>       
    </div>

  );//end return
  
}//end AddExpenseForm
 
const mapStateToProps = state => { 
  return {                    
    addExpenseError: state.expensesReducerIndex.addExpenseError,
    isAddingExpense: state.expensesReducerIndex.isAddingExpense,
    addedExpenseSuccess: state.expensesReducerIndex.addedExpenseSuccess,
    addedExpense: state.expensesReducerIndex.addedExpense
  }
}

export default connect(mapStateToProps, { addNewExpense, getAllExpenses })(AddExpenseForm);