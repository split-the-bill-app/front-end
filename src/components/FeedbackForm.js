import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";

export function FeedbackForm () {  


<form className="feedback-form" onSubmit={handleSubmit}>
  <h1>Notify Your Friends</h1>
  <textarea
    className="text-input"
    id="feedback-entry"
    name="feedback-entry"
    onChange={handleChange}
    placeholder="Enter your message here"
    required
    value={feedback}
  />
  <div className="btn-group">
    <button className="btn btn--cancel" onClick={handleClose}>
      Cancel
    </button>
    <input type="submit" value="Submit" className="btn btn--submit" />
  </div>
</form>

}