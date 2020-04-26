import React, { useEffect, useState } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

// import ExpenseDetails from "./ExpenseDetails.js";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";

function AddExpenseForm(props) {  

  let [notesCounter, setNotesCounter] = useState(0);
  let [descCounter, setDescCounter] = useState(0);
  const notesWordCount = 35;
  const descWordCount = 15;
  
  const { errors, touched, isSubmitting, status, handleChange} = props;
 
  //used to display the form data on the screen  
  useEffect(() => {
    if (status) {//status is a default prop on Formik
        props.addExpense(status); //calls the addExpense function in Dashboard.js
    }
  }, [status]);

  const notesCounterHandler = (event) => {

    //use Formik's handleChange prop, destructured on line 14
    handleChange(event);

    //shows remaining characters in the description field (out of 15)
    if(notesCounter >= 0 && notesCounter <= notesWordCount){
      setNotesCounter(notesWordCount - event.target.value.length)
    }     

  }

  const descCounterHandler = (event) => {

    //use Formik's handleChange prop, destructured on line 14
    handleChange(event);

    //shows remaining characters in the description field (out of 15)
    if(descCounter >= 0 && descCounter <= descWordCount){
      setDescCounter(descWordCount - event.target.value.length)
    }     

  }

  return (

    <div className = "expense-form-div">         

        <Form className = "expense-form">                       
          <Field className = "form-input" type="number" name="split_sum" placeholder="How much was the bill?" />
          {touched.split_sum && errors.split_sum && <p>{errors.split_sum}</p>}       
          
          <Field className = "form-input" type="number" name="split_people_count" placeholder="How many people are paying?" />
          {touched.split_people_count && errors.split_people_count && <p>{errors.split_people_count}</p>}

          {/*notes text field*/}
          <div className = "expense-description">   
            {/*Formik's onChange syntax */}          
            <Field onChange = {e => notesCounterHandler(e)} 
                  className = "form-input-description" 
                  type="text" maxlength="35" 
                  name="notes" 
                  placeholder="Notes... only you will be able to see this" />                  
            {touched.notes && errors.notes && <p>{errors.notes}</p>} 

            <div className = "counter">{notesCounter}/{notesWordCount}</div> 

          </div> 

          {/*what was this for? text field*/}
          <div className = "expense-description">   
            {/*Formik's onChange syntax */}          
            <Field onChange = {e => descCounterHandler(e)} 
                  className = "form-input-description" 
                  type="text" maxlength="15" 
                  name="description" 
                  placeholder="What was this for?...this will be shared with friends" />                  
            {touched.description && errors.description && <p>{errors.description}</p>}                                   

            <div className = "counter">{descCounter}/{descWordCount}</div>    

          </div>          
                             
          <button type="submit" disabled={isSubmitting}>Calculate</button>
          
        </Form>       

    </div>
   
  );
}

//higher order function that takes AddExpenseForm as an argument and returns a new Form:FormikAddExpenseForm
const FormikAddExpenseForm = withFormik({   

  /*mapPropsToValues is used to initialise the values of the form state. Formik transfers the results of 
    mapPropsToValues into updatable form state and makes these values available to the new component as props.values.*/
  mapPropsToValues({ split_sum, split_people_count, notes, description }) {
    return { 
      split_sum: split_sum || "",
      split_people_count: split_people_count || "", 
      notes: notes || "",     
      description: description || ""       
     
    };
  },

  //YUP VALIDATION: validationSchema- helps with validation inside the form
  //shape refers to the shape of the data type that we are looking for, for eg. string is required for text fields
  validationSchema: Yup.object().shape({  
    split_sum: Yup.number()      
      .required("Total is required"), 
    split_people_count: Yup.number()      
      .required("Number of people is required"),
    description: Yup.string()
       
  }),

  //formik handles all side effects so we dont need to use useEffect
  handleSubmit(values, { resetForm, setErrors, setStatus, setSubmitting }) {

    const split_each_amount = (values.split_sum/values.split_people_count).toFixed(2);   
    console.log("split each amount in add expense form", split_each_amount);

    axiosWithAuth()       
      .post("https://split-the-bill-app.herokuapp.com/api/bills/", {...values, split_each_amount: split_each_amount, user_id: localStorage.getItem('userId')})
      .then(res => {
        console.log("add expense", res); // Data was created successfully and logs to console

        //setStatus handles data coming back from the server- setting status gives you a way to communicate with your component
        //used to manage our local state inside our component
        setStatus(res.data);
        console.log("data coming back after add", res.data);
        resetForm();
        setSubmitting(false);
    })
    .catch(err => {
        console.log(err.response); // There was an error creating the data and logs to console
        setSubmitting(false);
    });     

  }

})(AddExpenseForm); //end FormikAddExpenseForm

export default FormikAddExpenseForm;
