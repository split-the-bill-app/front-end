import axios from 'axios';
import { axiosWithAuth } from '../../utils/axiosWithAuth.js';

export const GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START = 'GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START';
export const GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS = 'GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS';
export const GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE = 'GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE';
export const SEND_NOTIFICATIONS_FOR_A_BILL_START = 'SEND_NOTIFICATIONS_FOR_A_BILL_START';
export const SEND_NOTIFICATIONS_FOR_A_BILL_SUCCESS = 'SEND_NOTIFICATIONS_FOR_A_BILL_SUCCESS';
export const SEND_NOTIFICATIONS_FOR_A_BILL_FAILURE = 'SEND_NOTIFICATIONS_FOR_A_BILL_FAILURE';
export const DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_START = 'DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_START';
export const DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS = 'DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS';
export const DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE = 'DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE';

export const GET_ALL_SENT_NOTIFICATIONS_START = 'GET_ALL_SENT_NOTIFICATIONS_START'; //YOUR FRIENDS OWE YOU
export const GET_ALL_SENT_NOTIFICATIONS_SUCCESS = 'GET_ALL_SENT_NOTIFICATIONS_SUCCESS';
export const GET_ALL_SENT_NOTIFICATIONS_FAILURE = 'GET_ALL_SENT_NOTIFICATIONS_FAILURE';
export const GET_ALL_PAID_SENT_NOTIFICATIONS_START = 'GET_ALL_PAID_SENT_NOTIFICATIONS_START'; //YOUR FRIENDS OWE YOU
export const GET_ALL_PAID_SENT_NOTIFICATIONS_SUCCESS = 'GET_ALL_PAID_SENT_NOTIFICATIONS_SUCCESS';
export const GET_ALL_PAID_SENT_NOTIFICATIONS_FAILURE = 'GET_ALL_PAID_SENT_NOTIFICATIONS_FAILURE';
export const DELETE_SENT_NOTIFICATION_START = 'DELETE_SENT_NOTIFICATION_START';
export const DELETE_SENT_NOTIFICATION_SUCCESS = 'DELETE_SENT_NOTIFICATION_SUCCESS';
export const DELETE_SENT_NOTIFICATION_FAILURE = 'DELETE_SENT_NOTIFICATION_FAILURE';
export const SET_NOTIFICATION_PAID_OR_UNPAID_START = 'SET_NOTIFICATION_PAID_OR_UNPAID_START';
export const SET_NOTIFICATION_PAID_OR_UNPAID_SUCCESS = 'SET_NOTIFICATION_PAID_OR_UNPAID_SUCCESS';
export const SET_NOTIFICATION_PAID_OR_UNPAID_FAILURE = 'SET_NOTIFICATION_PAID_OR_UNPAID_FAILURE';


export const getAllSentNotificationsForABill = expenseId => dispatch => {
    dispatch({ type: GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START })

    axiosWithAuth().get(`https://split-the-bill-app.herokuapp.com/api/bills/${expenseId}/notifications`)
    .then(res => {
        console.log("get all sent notfications for a bill in actions", res.data);
        dispatch({ type: GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS, payload: res.data});
    })
    .catch(err => {
        dispatch({ type: GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE, error: err})
    })
}//end getAllSentNotificationsForABill

export const sendNotificationsForABill = newNotifications => dispatch => {
    dispatch({ type: SEND_NOTIFICATIONS_FOR_A_BILL_START})

    axiosWithAuth().post('https://split-the-bill-app.herokuapp.com/api/notifications')
    .then(res => {
        console.log("send notifications for a bill in action", res.data)
        dispatch({ type: SEND_NOTIFICATIONS_FOR_A_BILL_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: SEND_NOTIFICATIONS_FOR_A_BILL_FAILURE, error: err})
    })
}//end sendNotificationsForABill

export const deleteSentNotificationsForABill = expenseId => dispatch => {
    dispatch({ type: DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_START });

    axiosWithAuth().post(`https://split-the-bill-app.herokuapp.com/api/bills/$expenseId}/notification`)
    .then(res => {
        console.log("delete notification for a bill response in actions", res.data);
        dispatch({ type: DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: DELETE_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE, error: err })
    })

}//end deleteSentNotificationsForABill