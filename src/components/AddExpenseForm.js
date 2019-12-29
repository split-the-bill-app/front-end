import React, { useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";


// import ExpenseDetails from "./ExpenseDetails.js";
import { axiosWithAuth } from "../utils/axiosWithAuth.js";

function AddExpenseForm(props) {  

   const { errors, touched, isSubmitting, status } = props;

  //used to display the form data on the screen  
  useEffect(() => {
    if (status) {//status is a default prop on Formik
        props.addExpense(status); //calls the addExpense function in Dashboard.js
    }
  }, [status]);

  return (

    <div className = "expense-form-div">  
       

        <Form className = "expense-form">

                 
            {/*<Field className = "form-input" type="text" name="expensetitle" placeholder="What is this expense for?" />
            {touched.expensetitle && errors.expensetitle && <p>{errors.expensetitle}</p>}*/}       

                
            <Field className = "form-input" type="number" name="split_sum" placeholder="How much was the bill?" />
            {touched.split_sum && errors.split_sum && <p>{errors.split_sum}</p>}        

            
            <Field className = "form-input" type="number" name="split_people_count" placeholder="How many people are paying?" />
            {touched.split_people_count && errors.split_people_count && <p>{errors.split_people_count}</p>}
         

                 
           {/* <Field className = "form-input" type="text" name="name" placeholder="Names of your friends" />
            {touched.name && errors.name && <p>{errors.name}</p>}
         
         
               
            <Field className = "form-input" type="email" name="email" placeholder="Their Email Addresses" />
          {touched.email && errors.email && <p>{errors.email}</p>} */}
                
                             
          <button type="submit" disabled={isSubmitting}>Calculate</button>
          
        </Form>
       

    </div>
   
  );
}

//higher order function that takes LoginForm as an argument and returns a new Form:FormikLoginForm
const FormikAddExpenseForm = withFormik({

  /*mapPropsToValues is used to initialise the values of the form state. Formik transfers the results of 
    mapPropsToValues into updatable form state and makes these values available to the new component as props.values.*/
  mapPropsToValues({ split_sum, split_people_count }) {
    return { 
      split_sum: split_sum || "",
      split_people_count: split_people_count || ""       
     
    };
  },

  //YUP VALIDATION: validationSchema- helps with validation inside the form
  //shape refers to the shape of the data type that we are looking for, for eg. string is required for text fields
  validationSchema: Yup.object().shape({  
    split_sum: Yup.number()      
      .required("Total is required"), 
    split_people_count: Yup.number()      
      .required("Number of people is required")
       
  }),

  //formik handles all side effects so we dont need to use useEffect
  handleSubmit(values, { resetForm, setErrors, setStatus, setSubmitting }) {
    axiosWithAuth()       
      .post("https://build-split-the-bill.herokuapp.com/api/bills/", {...values, user_id: localStorage.getItem('userId')})
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

