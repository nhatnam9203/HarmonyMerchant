import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    appointmentDetail: {},
    isGetAppointmentSucces: false,
    visiblePaymentCompleted: false,
    isDonePayment: false,
    connectionSignalR: {},
    flagSignInAppointment: false,
    // listAppointmentsOfflineMode: [],

    groupAppointment: {},
    paymentDetailInfo: {},
    visiblePopupPaymentDetails: false,
    visibleChangeMoney: false,
    moneyChanged: 0,
    payAppointmentId: 0,
    isCancelAppointment: false,
    visiblePopupActiveGiftCard: false,
    webviewRef: {},
    appointmentIdOffline: 0,

    isCheckAppointmentBeforeOffline: false,
    blockAppointments: [],
    isOpenBlockAppointmentId: "",
    isLoadingGetBlockAppointment: false,
    isLoadingRemoveBlockAppointment: false,
    idNextToAppointmentRemove: -1
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        // case 'REHYDRATE_APPOINTMENT':
        //     return {
        //         ...initialState,
        //         listAppointmentsOfflineMode: action.payload,
        //     }
        case 'RESET_GROUP_APPOINTMENT':
            return {
                ...initialState,
                groupAppointment: {},
            }

        case 'CHECKOUT_SUBMIT_SUCCESS':
            return {
                ...state,
                paymentDetailInfo: action.payload,
                visiblePopupPaymentDetails: action.visiblePopupPaymentDetails ? action.visiblePopupPaymentDetails : false
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
                paymentDetailInfo: action.paymentDetailInfo,

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
                paymentDetailInfo: {}
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
        case 'CHECK_OUT_APPOINTMENT_OFFLINE':
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
        case 'TRACSACTION_COMPLETED': {
            return {
                ...state,
                visibleChangeMoney: false,
                moneyChanged: 0,
                visiblePaymentCompleted: true,

            }
        }
        case 'SHOW_POPUP_CHANGED_MONEY':
            return {
                ...state,
                visibleChangeMoney: true,
                moneyChanged: action.payload
            }

        case 'UPDATE_PAYMENT_DETAIL_INFO_BY_HARMONY_PAYMENT':
            return {
                ...state,
                paymentDetailInfo: action.payload,
            }
        case 'SHOW_POPUP_PAYMENT_DETAILS':
            return {
                ...state,
                visiblePopupPaymentDetails: true
            }
        case 'PAY_APPOINTMENT_ID':
            return {
                ...state,
                payAppointmentId: action.payload
            }
        case 'SET_CANCEL_APPOINTMENT':
            return {
                ...state,
                isCancelAppointment: true
            }
        case 'VISIBLE_POPUP_ACTIVEE_GIFT_CARD':
            return {
                ...state,
                visiblePopupActiveGiftCard: action.payload
            }

        case 'ADD_ITEM_INTO_APPOINTMENT':
            return {
                ...state,
                visiblePopupActiveGiftCard: false
            }
        case 'CREATE_ANYMOUS_APPOINTMENT':
            return {
                ...state,
                visiblePopupActiveGiftCard: false
            }
        case 'SET_WEBVIEW_REF_TO_REDUX':
            return {
                ...state,
                webviewRef: action.payload
            }
        case 'CHECK_APPOINTMENT_BEFORE_OFFLINE':
            return {
                ...state,
                isCheckAppointmentBeforeOffline: action.payload
            }
        case 'GET_BLOCK_APPOINTMENT_BY_ID':
            return {
                ...state,
                isOpenBlockAppointmentId: action.appointmentId,
                isLoadingGetBlockAppointment: true,
            }
        case 'GET_BLOCK_APPOINTMENT_BY_ID_SUCCESS':
            return {
                ...state,
                blockAppointments: mergeBlockAppointment([...state.blockAppointments], { ...action.payload }),
                isLoadingGetBlockAppointment: false
            }
        case 'GET_BLOCK_APPOINTMENT_BY_ID_FAIL':
            return {
                ...state,
                isLoadingGetBlockAppointment: false,
            }
        case 'CANCEL_APPOINTMENT':
            return {
                ...state,
                isLoadingRemoveBlockAppointment: action.isBlock && !action.isCancelManyAppointment ? true : false,
            }
        case 'CANCEL_APPOINTMENT_FAIL':
            return {
                ...state,
                isLoadingRemoveBlockAppointment: false,
            }
        case 'REMOVE_BLOCK_APPOINTMENT_IN_REDUX':
            return {
                ...state,
                isLoadingRemoveBlockAppointment: false,
                blockAppointments: (removeBlockAppointment([...state.blockAppointments], action.payload)).data,
                idNextToAppointmentRemove: (removeBlockAppointment([...state.blockAppointments], action.payload)).indexExist
            }
        case 'ADD_BLOCK_APPOINTMENT_REF':
            return {
                ...state,
                blockAppointments_Ref: ([...state.blockAppointments_Ref]).push(action.payload),
            }
        case 'BOOK_BLOCK_APPOINTMENT':
            return {
                ...state,
                blockAppointments: [],
            }
        case 'UPDATE_ID__APPOINTMENT_IS_OPEN':
            return {
                ...state,
                isOpenBlockAppointmentId: action.payload,
            }
        default:
            return state
    }
}

const mergeBlockAppointment = (blockAppointments, newAppointment) => {
    let indexAppointmentExist = -1;
    for (let i = 0; i < blockAppointments.length; i++) {
        if (blockAppointments[i].appointmentId === newAppointment.appointmentId) {
            indexAppointmentExist = i;
            break;
        }
    }
    if (indexAppointmentExist === -1) {
        return blockAppointments.concat([newAppointment]);
    } else {
        const newBlockAppointments = [];
        for (let i = 0; i < blockAppointments.length; i++) {
            if (indexAppointmentExist == i) {
                newBlockAppointments.push(newAppointment);
            } else {
                newBlockAppointments.push(blockAppointments[i]);
            }
        }

        return newBlockAppointments;
    }
}

const removeBlockAppointment = (blockAppointments, appointmentIdRemove) => {
    let indexExist = -1;
    const temptBlockAppointments = [];

    for (let i = 0; i < blockAppointments.length; i++) {

        if (blockAppointments[i].appointmentId == appointmentIdRemove) {
            indexExist = i;
        } else {
            temptBlockAppointments.push(blockAppointments[i]);
        }
    }


    console.log("------ indexExist : ", indexExist);
    console.log("------ temptBlockAppointments : ", temptBlockAppointments);

    return {
        data: temptBlockAppointments,
        indexExist
    };
}



// const persistConfig = {
//     key: 'appointment',
//     storage: AsyncStorage,
//     whitelist: ['listAppointmentsOfflineMode']
// };

// module.exports = persistReducer(persistConfig, appReducer);
module.exports = appReducer;

