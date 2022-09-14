import { axiosWithAuth } from '../../utils/axiosWithAuth.js';

export const GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START = 'GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START';
export const GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS = 'GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS';
export const GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE = 'GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE';
export const SEND_NOTIFICATIONS_FOR_A_BILL_START = 'SEND_NOTIFICATIONS_FOR_A_BILL_START';
export const SEND_NOTIFICATIONS_FOR_A_BILL_SUCCESS = 'SEND_NOTIFICATIONS_FOR_A_BILL_SUCCESS';
export const SEND_NOTIFICATIONS_FOR_A_BILL_FAILURE = 'SEND_NOTIFICATIONS_FOR_A_BILL_FAILURE';
export const DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START = 'DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START';
export const DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS = 'DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS';
export const DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE = 'DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE';
export const GET_ALL_SENT_OWED_NOTIFICATIONS_START = 'GET_ALL_SENT_OWED_NOTIFICATIONS_START';//YOUR FRIENDS OWE YOU
export const GET_ALL_SENT_OWED_NOTIFICATIONS_SUCCESS = 'GET_ALL_SENT_OWED_NOTIFICATIONS_SUCCESS';
export const GET_ALL_SENT_OWED_NOTIFICATIONS_FAILURE = 'GET_ALL_SENT_OWED_NOTIFICATIONS_FAILURE';
export const GET_ALL_SENT_PAID_NOTIFICATIONS_START = 'GET_ALL_SENT_PAID_NOTIFICATIONS_START';//YOUR FRIENDS OWE YOU
export const GET_ALL_SENT_PAID_NOTIFICATIONS_SUCCESS = 'GET_ALL_SENT_PAID_NOTIFICATIONS_SUCCESS';
export const GET_ALL_SENT_PAID_NOTIFICATIONS_FAILURE = 'GET_ALL_SENT_PAID_NOTIFICATIONS_FAILURE';
export const GET_ALL_RECEIVED_NOTIFICATIONS_START = 'GET_ALL_RECEIVED_NOTIFICATIONS_START';//YOU OWE YOUR FRIENDS
export const GET_ALL_RECEIVED_NOTIFICATIONS_SUCCESS = 'GET_ALL_RECEIVED_NOTIFICATIONS_SUCCESS';
export const GET_ALL_RECEIVED_NOTIFICATIONS_FAILURE = 'GET_ALL_RECEIVED_NOTIFICATIONS_FAILURE';
export const DELETE_SENT_NOTIFICATION_START = 'DELETE_SENT_NOTIFICATION_START';
export const DELETE_SENT_NOTIFICATION_SUCCESS = 'DELETE_SENT_NOTIFICATION_SUCCESS';
export const DELETE_SENT_NOTIFICATION_FAILURE = 'DELETE_SENT_NOTIFICATION_FAILURE';
export const SET_NOTIFICATION_PAID_OR_UNPAID_START = 'SET_NOTIFICATION_PAID_OR_UNPAID_START';
export const SET_NOTIFICATION_PAID_OR_UNPAID_SUCCESS = 'SET_NOTIFICATION_PAID_OR_UNPAID_SUCCESS';
export const SET_NOTIFICATION_PAID_OR_UNPAID_FAILURE = 'SET_NOTIFICATION_PAID_OR_UNPAID_FAILURE';

export const getAllSentNotificationsForABill = expenseId => dispatch => {
    dispatch({ type: GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START })

    //axiosWithAuth().get(`http://localhost:5000/api/bills/${expenseId}/notifications`)
    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/bills/${expenseId}/notifications`)
    .then(res => {       
        dispatch({ type: GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS, payload: res.data});
    })
    .catch(err => {
        dispatch({ type: GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE, error: err})
    })
}//end getAllSentNotificationsForABill

export const sendNotificationsForABill = newNotifications => dispatch => {
    dispatch({ type: SEND_NOTIFICATIONS_FOR_A_BILL_START})

    //axiosWithAuth().post('http://localhost:5000/api/notifications', newNotifications)
    axiosWithAuth().post('https://split-the-bill-app-main.herokuapp.com/api/notifications', newNotifications)
    .then(res => {       
        dispatch({ type: SEND_NOTIFICATIONS_FOR_A_BILL_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: SEND_NOTIFICATIONS_FOR_A_BILL_FAILURE, error: err})
    })
}//end sendNotificationsForABill

//delete all notifications for a bill
export const deleteSentNotificationsForABill = expenseId => dispatch => {
    dispatch({ type: DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START });

    //axiosWithAuth().delete(`http://localhost:5000/api/bills/${expenseId}/notifications`)
    axiosWithAuth().delete(`https://split-the-bill-app-main.herokuapp.com/api/bills/${expenseId}/notifications`)
    .then(res => {        
        dispatch({ type: DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE, error: err })
    })
}//end deleteSentNotificationsForABill

//get all sent notifications that are still outstanding
export const getAllSentOwedNotifications = userId => dispatch => {
    dispatch({ type: GET_ALL_SENT_OWED_NOTIFICATIONS_START });

    //axiosWithAuth().get(`http://localhost:5000/api/bills/notifications/owed/${userId}`)
    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/bills/notifications/owed/${userId}`)
    .then(res => {       
        dispatch({ type: GET_ALL_SENT_OWED_NOTIFICATIONS_SUCCESS, payload: res.data });
    })
    .catch(err => {
        dispatch({ type: GET_ALL_SENT_OWED_NOTIFICATIONS_FAILURE, error: err });
    })
}//end getAllSentNotifications

//get all sent notifications that are marked as paid
export const getAllSentPaidNotifications = userId => dispatch => {
    dispatch({ type: GET_ALL_SENT_PAID_NOTIFICATIONS_START });

    //axiosWithAuth().get(`http://localhost:5000/api/bills/notifications/paid/${userId}`)
    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/bills/notifications/paid/${userId}`)
    .then(res => {        
        dispatch({ type: GET_ALL_SENT_PAID_NOTIFICATIONS_SUCCESS, payload: res.data });
    })
    .catch(err => {
        dispatch({ type:  GET_ALL_SENT_PAID_NOTIFICATIONS_FAILURE, error: err })
    })
}//end getAllSentPaidNotifications

//get all received notfications (you owe your friends)
export const getReceivedNotifications = userEmail => dispatch => {
    dispatch({ type: GET_ALL_RECEIVED_NOTIFICATIONS_START });

    //axiosWithAuth().get(`http://localhost:5000/api/bills/notifications/${userEmail}`)
    axiosWithAuth().get(`https://split-the-bill-app-main.herokuapp.com/api/bills/notifications/${userEmail}`)
    .then(res => {        
        dispatch({ type: GET_ALL_RECEIVED_NOTIFICATIONS_SUCCESS, payload: res.data });
    })
    .catch(err => {
        dispatch({ type: GET_ALL_RECEIVED_NOTIFICATIONS_FAILURE, error: err });
    })
}//end getReceivedNotifications

//delete a single notification
export const deleteSentNotification = notificationId => dispatch => {
    dispatch({ type: DELETE_SENT_NOTIFICATION_START })

    //axiosWithAuth().delete(`http://localhost:5000/api/notifications/${notificationId}`)
    axiosWithAuth().delete(`https://split-the-bill-app-main.herokuapp.com/api/notifications/${notificationId}`)
    .then(res => {
        dispatch({ type: DELETE_SENT_NOTIFICATION_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: DELETE_SENT_NOTIFICATION_FAILURE, error: err })
    })
}//end deleteNotification

export const updateNotificationPaidStatus = (notificationId, paidStatus) => dispatch => {
    dispatch({ type: SET_NOTIFICATION_PAID_OR_UNPAID_START })

    //axiosWithAuth().put(`http://localhost:5000/api/notifications/${notificationId}`, paidStatus)
    axiosWithAuth().put(`https://split-the-bill-app-main.herokuapp.com/api/notifications/${notificationId}`, paidStatus)
    .then(res => {        
        dispatch({ type: SET_NOTIFICATION_PAID_OR_UNPAID_SUCCESS, payload: res.data })
    })
    .catch(err => {
        dispatch({ type: SET_NOTIFICATION_PAID_OR_UNPAID_FAILURE, error: err })
    })
}//end updateNotificationPaidStatus



