import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import { getExpenseToEdit, editExistingExpense } from "../redux_store/actions"
import axios from "axios";
import {axiosWithAuth} from "../utils/axiosWithAuth.js";

function EditExpenseForm(props) {

  const [expenseToEdit, setExpenseToEdit] = useState({});

  let [notesCounter, setNotesCounter] = useState(0);
  let [descCounter, setDescCounter] = useState(0);
  const notesWordCount = 35;
  const descWordCount = 15;

  useEffect (() => {

    console.log("expense id in edit expense form", props.expenseId)
    props.getExpenseToEdit(props.expenseId);    
    
  }, [])

  useEffect (() => {
    
    console.log("expense to edit in edit expense form before if", props.returnedExpenseToEdit);
    
    if(props.returnedExpenseToEdit){
      setExpenseToEdit(props.returnedExpenseToEdit); //props.expenseToEdit is the redux state
      console.log("expense to edit in edit expense form", props.returnedExpenseToEdit);
    }   
    
  }, [props.returnedExpenseToEdit])

  useEffect( () => {
    const split_each_amount = (expenseToEdit.split_sum/expenseToEdit.split_people_count).toFixed(2); 

    if(props.editExpenseConfirmation){
      props.editExpense({...expenseToEdit, split_each_amount: split_each_amount});
     
      //server actually returns a success message and not the edited expense     
      console.log("edited expense returned from server", props.editExpenseConfirmation);     

      window.location.reload(true);

      //THE SERVER RETURNS THE ENTIRE LIST OF BILLS WHEN THE APP LOADS OR THE SCREEN IS REFRESHED 
      //SO WHEN CALCULATE IS CLICKED ON THE EDIT EXPENSE FORM YOU COULD REFRESH THE SCREEN
      //BY NOT USING event.preventDefault() OR USING window.location.reload(true) 
      //OR USE THE props.editExpense function in dashboard FUNCTION AND THE UPDATED BILL WILL BE DISPLAYED. 
      //AFTER A BILL IS EDITED THE SERVER RETURNS A SUCCESS MESSAGE AND NOT ACTUAL DATA

      //props.editExpense in dashboard
      //props.editExpense({...expenseToEdit, split_each_amount: split_each_amount});
     
      //window.location.reload(true);
    
    }

  }, [props.editExpenseConfirmation])
  

  const handleChange = (event) => {  

    //shows remaining characters in the notes field (out of 35)
    if(notesCounter >= 0 && notesCounter <= notesWordCount){
      setNotesCounter(notesWordCount - event.target.value.length)
    }     
    
    //shows remaining characters in the description field (out of 15)
    if(descCounter >= 0 && descCounter <= descWordCount){
      setDescCounter(descWordCount - event.target.value.length)
    }     
    
    setExpenseToEdit ({
      ...expenseToEdit, [event.target.name]: event.target.value
    })
    
  }

  const submitHandler = (event) => {
    const split_each_amount = (expenseToEdit.split_sum/expenseToEdit.split_people_count).toFixed(2);   
    console.log("split each amount in edit expense form", split_each_amount);    

    event.preventDefault();

    props.editExistingExpense({...expenseToEdit, split_each_amount: split_each_amount}, props.expenseId);    
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
                  name="notes"  
                  value = {expenseToEdit.notes} 
                  placeholder="Notes... only you will be able to see this..."
                  maxLength="35"
                  onChange = {handleChange}/>

            <div className = "counter">{notesCounter}/{notesWordCount}</div>  

          </div>  

          <div className = "expense-description">    
            <input type = "text" 
                  className = "form-input-description"
                  name="description"  
                  value = {expenseToEdit.description} 
                  placeholder="What is this for?"
                  maxLength="15"
                  onChange = {handleChange}/>

            <div className = "counter">{descCounter}/{descWordCount}</div>  

          </div>  

          <button type="submit" > Calculate </button>

        </form>            

    </div>

  );
}

const mapStateToProps = state => {
  //console.log("returned expense to edit in map state to props", state.expensesReducerIndex.expenseToEdit)
  return {
    isGettingExpenseToEdit: state.expensesReducerIndex.isGettingExpenseToEdit,                
    returnedExpenseToEdit: state.expensesReducerIndex.expenseToEdit,
    getExpenseToEditSuccess: state.expensesReducerIndex.getExpenseToEditSuccess,
    getExpenseToEditError: state.expensesReducerIndex.getExpenseToEditError,   
    editExpenseError: state.expensesReducerIndex.editExpenseError,
    isEditingExpense: state.expensesReducerIndex.isEditingExpense,
    editExpenseSuccess: state.expensesReducerIndex.editExpenseSuccess,
    editExpenseConfirmation: state.expensesReducerIndex.editExpenseConfirmation
  }
}

export default connect(mapStateToProps, { getExpenseToEdit, editExistingExpense })(EditExpenseForm);