import axios from "axios";

export const axiosWithAuth = () => {  
  const token = localStorage.getItem("token");

  // return the token as the header prop 'Authorization' 
  // to be used to authenticate on API requests
  return axios.create({
    headers: {
      Authorization: token
    }
  });
};