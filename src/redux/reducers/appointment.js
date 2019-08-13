const initialState = {
    appointmentDetail: {},
    isGetAppointmentSucces: false,
    visiblePaymentCompleted: false,
    isDonePayment: false,
    appointmentIdOffline: '',
    connectionSignalR: {},
    flagSignInAppointment: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_APPOINTMENT_BY_ID_SUCCESS':
            return {
                ...state,
                appointmentDetail: action.payload,
                isGetAppointmentSucces: true
            }
        case 'GET_APPOINTMENT_BY_ID_FAIL':
            return {
                ...state,
                appointmentDetail: {}
            }
        case 'RESET_KEY_GET_APPOINTMENT':
            return {
                ...state,
                isGetAppointmentSucces: false
            }
        case 'RESET_BASKET_EMPTY':
            return {
                ...state,
                appointmentDetail: {}
            }
        case 'PAY_APPOINTMENT_SUCCESS':
            return {
                ...state,
                // visiblePaymentCompleted: true,
                isDonePayment: true
            }
        case 'CLOSE_MODAL_PAYMENT_COMPLETED':
            return {
                ...state,
                visiblePaymentCompleted: false
            }
        case 'RESET_PAYMENT':
            return {
                ...state,
                isDonePayment: false
            }
        case 'SHOW_MODAL_PRINT_RECEIPT':
            return {
                ...state,
                visiblePaymentCompleted: true
            }
        case 'CHECK_OUT_APPOINTMENT_OFFLINE_SUCCESS':
            return {
                ...state,
                appointmentIdOffline: action.payload
            }
        case 'REFERENCE_CONNECTION_SIGNALR':
            return {
                ...state,
                connectionSignalR: action.payload
            }
        case 'RESET_CONNECT_SIGNALR':
            return {
                ...state,
                connectionSignalR: {}
            }
        case 'CHANGE_FLAG_APPOINTMENT' :
            return {
                ...state,
                flagSignInAppointment:action.payload
            }




        default:
            return state
    }
}

module.exports = appReducer;
