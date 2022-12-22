import {
    GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START,
    GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS,
    GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE,
    SEND_NOTIFICATIONS_FOR_A_BILL_START,
    SEND_NOTIFICATIONS_FOR_A_BILL_SUCCESS,
    SEND_NOTIFICATIONS_FOR_A_BILL_FAILURE,
    DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START,
    DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS,
    DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE,
    GET_ALL_SENT_OWED_NOTIFICATIONS_START, //YOUR FRIENDS OWE YOU
    GET_ALL_SENT_OWED_NOTIFICATIONS_SUCCESS,
    GET_ALL_SENT_OWED_NOTIFICATIONS_FAILURE,
    GET_ALL_SENT_PAID_NOTIFICATIONS_START, //YOUR FRIENDS OWE YOU (PAID)
    GET_ALL_SENT_PAID_NOTIFICATIONS_SUCCESS,
    GET_ALL_SENT_PAID_NOTIFICATIONS_FAILURE,
    GET_ALL_RECEIVED_NOTIFICATIONS_START, //YOU OWE YOUR FRIENDS
    GET_ALL_RECEIVED_NOTIFICATIONS_SUCCESS,
    GET_ALL_RECEIVED_NOTIFICATIONS_FAILURE,
    DELETE_SENT_NOTIFICATION_START,
    DELETE_SENT_NOTIFICATION_SUCCESS,
    DELETE_SENT_NOTIFICATION_FAILURE,
    SET_NOTIFICATION_PAID_OR_UNPAID_START,
    SET_NOTIFICATION_PAID_OR_UNPAID_SUCCESS,
    SET_NOTIFICATION_PAID_OR_UNPAID_FAILURE
}from '../actions';

const initialState = {
    getAllSentNotificationsError: null,
    isGettingAllSentNotifications: false,
    getAllSentNotificationsSuccess: false,
    allSentNotifications: [],
    sendNotificationsError: null,
    isSendingNotifications: false,
    sendNotificationsSuccess: false,
    sentNotificationsConfirmation: "", //server returns a success message
    deleteAllBillNotificationsError: null, //delete all notifications for a single bill
    isDeletingAllBillNotifications: false,
    deleteAllBillNotificationsSuccess: false,
    deleteAllBillNotificationsConfirmation: "", //server returns a success message
    getAllSentOwedNotificationsError: null,//your friends owe you
    isGettingAllSentOwedNotifications: false,
    getAllSentOwedNotificationsSuccess: false,
    allSentOwedNotifications: [],
    getAllSentPaidNotificationsError: null,//your friends paid what they owe you
    isGettingAllSentPaidNotifications: false,
    getAllSentPaidNotificationsSuccess: false,
    allSentPaidNotifications: [],
    getAllReceivedNotificationsError: null,//you owe your friends
    isGettingAllReceivedNotifications: false,
    getAllReceivedNotificationsSuccess: false,
    allReceivedNotifications: [],
    deleteSentNotificationError: null, //delete individual sent notifications
    isDeletingSentNotification: false,
    deleteSentNotificationSuccess: false,
    deleteSentNotificationConfirmation: "", //returns a confirmation message
    updateNotificationPaidStatusError: null, //update a notification from paid to unpaid or unpaid to paid
    isUpdatingNotificationPaidStatus: false,
    updateNotificationPaidStatusSuccess: false,
    updateNotificationPaidStatusConfirmation: "", //returns a confirmation message  
    
}

export const notificationsReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START:
            return{
                ...state,
                getAllSentNotificationsError: null,
                isGettingAllSentNotifications: true                  
            };
        case GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS:            
            return{
                ...state,
                getAllSentNotificationsError: null,
                isGettingAllSentNotifications: false,
                getAllSentNotificationsSuccess: true,
                allSentNotifications: action.payload   
            };
        case GET_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE:
            return{
                ...state,
                getAllSentNotificationsError: action.error,
                isGettingAllSentNotifications: false,
                allSentNotifications: []                               
            };                       
        case SEND_NOTIFICATIONS_FOR_A_BILL_START:
            return {
                ...state,
                sendNotificationsError: null,
                isSendingNotifications: true
            };
        case SEND_NOTIFICATIONS_FOR_A_BILL_SUCCESS:
            return {
                ...state,
                sendNotificationsError: null,
                isSendingNotifications: false,
                sendNotificationsSuccess: true,
                sentNotificationsConfirmation: action.payload
            };
        case SEND_NOTIFICATIONS_FOR_A_BILL_FAILURE:
            return {
                ...state,
                sendNotificationsError: action.error,
                isSendingNotifications: false                
            };
        case DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_START:
            return {
                ...state,
                deleteAllBillNotificationsError: null, //delete all notifications for a single bill
                isDeletingAllBillNotifications: true                
            };
        case DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_SUCCESS:            
            return {
                ...state,
                deleteAllBillNotificationsError: null, //delete all notifications for a single bill
                isDeletingAllBillNotifications: false,
                deleteAllBillNotificationsSuccess: true,
                deleteAllBillNotificationsConfirmation: action.payload
            };
        case DELETE_ALL_SENT_NOTIFICATIONS_FOR_A_BILL_FAILURE:
            return {
                ...state,
                deleteAllBillNotificationsError: action.error, //delete all notifications for a single bill
                isDeletingAllBillNotifications: false                
            };
        case GET_ALL_SENT_OWED_NOTIFICATIONS_START:
            return {
                ...state,
                getAllSentOwedNotificationsError: null, //your friends owe you
                isGettingAllSentOwedNotifications: true                
            };
        case GET_ALL_SENT_OWED_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                getAllSentOwedNotificationsError: null,
                isGettingAllSentOwedNotifications: false,
                getAllSentOwedNotificationsSuccess: true,
                allSentOwedNotifications: action.payload
            };
        case GET_ALL_SENT_OWED_NOTIFICATIONS_FAILURE:
            return{
                ...state,
                getAllSentOwedNotificationsError: action.error,
                isGettingAllSentOwedNotifications: false,
                allSentOwedNotifications: []                               
            };                      
        case GET_ALL_SENT_PAID_NOTIFICATIONS_START:
            return {
                ...state,
                getAllSentPaidNotificationsError: null,//your friends paid what they owe you
                isGettingAllSentPaidNotifications: true                
            };
        case GET_ALL_SENT_PAID_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                getAllSentPaidNotificationsError: null,
                isGettingAllSentPaidNotifications: false,
                getAllSentPaidNotificationsSuccess: true,
                allSentPaidNotifications: action.payload
            };
        case GET_ALL_SENT_PAID_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                getAllSentPaidNotificationsError: action.error,
                isGettingAllSentPaidNotifications: false,
                allSentPaidNotifications: []               
            };                      
        case GET_ALL_RECEIVED_NOTIFICATIONS_START:
            return {
                ...state,
                getAllReceivedNotificationsError: null,//you owe your friends
                isGettingAllReceivedNotifications: true,
                allReceivedNotifications: []                
            };
        case GET_ALL_RECEIVED_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                getAllReceivedNotificationsError: null,
                isGettingAllReceivedNotifications: false,
                getAllReceivedNotificationsSuccess: true,
                allReceivedNotifications: action.payload
            };
        case GET_ALL_RECEIVED_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                getAllReceivedNotificationsError: action.error,
                isGettingAllReceivedNotifications: false                
            };
        case DELETE_SENT_NOTIFICATION_START:
            return {
                ...state,
                deleteSentNotificationError: null, //delete individual sent notifications
                isDeletingSentNotification: true
            };                
        case DELETE_SENT_NOTIFICATION_SUCCESS:
            return {
                ...state,
                deleteSentNotificationError: null,
                isDeletingSentNotification: false,
                deleteSentNotificationSuccess: true,
                deleteSentNotificationConfirmation: action.payload
            };
        case DELETE_SENT_NOTIFICATION_FAILURE:
            return {
                ...state,
                deleteSentNotificationError: action.error, //delete individual sent notifications
                isDeletingSentNotification: false                
            };
        case SET_NOTIFICATION_PAID_OR_UNPAID_START:
            return {
                ...state,
                updateNotificationPaidStatusError: null, //update a notification from paid to unpaid/vice versa
                isUpdatingNotificationPaidStatus: true                
            };
        case SET_NOTIFICATION_PAID_OR_UNPAID_SUCCESS:
            return {
                ...state,
                updateNotificationPaidStatusError: null, 
                isUpdatingNotificationPaidStatus: false,
                updateNotificationPaidStatusSuccess: true,
                updateNotificationPaidStatusConfirmation: action.payload
            };
        case SET_NOTIFICATION_PAID_OR_UNPAID_FAILURE:
            return {
                ...state,
                updateNotificationPaidStatusError: action.error,
                isUpdatingNotificationPaidStatus: false                
            };
        default:
            return state;
    }
}