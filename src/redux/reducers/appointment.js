import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    appointmentDetail: {},
    isGetAppointmentSucces: false,
    visiblePaymentCompleted: false,
    isDonePayment: false,
    appointmentIdOffline: '',
    connectionSignalR: {},
    flagSignInAppointment: false,
    listAppointmentsOfflineMode: [],

    groupAppointment: {},
    paymentDetilInfo: {},
    visiblePopupPaymentDetails: false,
    visibleChangeMoney: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_APPOINTMENT':
            return {
                ...initialState,
                listAppointmentsOfflineMode: action.payload,
            }
        case 'RESET_GROUP_APPOINTMENT':
            return {
                ...initialState,
                groupAppointment: {},
            }

        case 'CHECKOUT_SUBMIT_SUCCESS':
            return {
                ...state,
                paymentDetilInfo: action.payload,
                visiblePopupPaymentDetails: true
            }
        case 'CLOSE_POPUP_PAYMENT_DETAIL':
            return {
                ...state,
                visiblePopupPaymentDetails: false
            }
        case 'GET_APPOINTMENT_BY_ID_SUCCESS':
            return {
                ...state,
                appointmentDetail: action.payload,
                isGetAppointmentSucces: true
            }
        case 'GET_GROUP_APPOINTMENT_BY_ID_SUCCESS':
            return {
                ...state,
                groupAppointment: action.payload,
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
                appointmentDetail: {},
                groupAppointment: {},
                paymentDetilInfo: {}
            }
        case 'PAY_APPOINTMENT_SUCCESS':
            return {
                ...state,
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
        case 'CHANGE_FLAG_APPOINTMENT':
            return {
                ...state,
                flagSignInAppointment: action.payload
            }
        case 'ADD_APPOINTMENT_OFFLINE_MODE':
            return {
                ...state,
                listAppointmentsOfflineMode: [...state.listAppointmentsOfflineMode, action.payload]
            }
        case 'SUBMIT_APPOINTMENT_OFFLINE_SUCCESS': {
            return {
                ...state,
                listAppointmentsOfflineMode: []
            }
        }
        case 'TRACSACTION_COMPLETED': {
            return {
                ...state,
                visibleChangeMoney: false,
                visiblePaymentCompleted: true
              
            }
        }
        case 'SHOW_POPUP_CHANGED_MONEY':
            return {
                ...state,
                visibleChangeMoney: true
            }
        default:
            return state
    }
}



const persistConfig = {
    key: 'appointment',
    storage: AsyncStorage,
    whitelist: ['listAppointmentsOfflineMode']
};

// module.exports = persistReducer(persistConfig, appReducer);
module.exports = appReducer;

