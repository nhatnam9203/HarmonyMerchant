import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    appointmentDetail: {},
    isGetAppointmentSucces: false,
    visiblePaymentCompleted: false,
    isDonePayment: false,
    connectionSignalR: {},
    flagSignInAppointment: false,
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
    idNextToAppointmentRemove: -1,
    fromTimeBlockAppointment: new Date(),

    customerInfoBuyAppointment: {
        customerId: 0,
        userId: 0,
        firstName: "",
        lastName: "",
        phone: ""
    },
    visibleEnterCustmerPhonePopup: false,
    bookingGroupId: 0,
    giftcardPaymentInfo: {},
    visiblePopupGiftCardDetails: false,
    visiblePopupGiftCardEnterAmount: false,
    addGiftCardInfoAction: {},
    isUpdateQuantityOfGiftCard: false,
    giftCardsList: [],
    totalGiftCardsListPages: 0,
    currentGiftCardsListPage: 0,
    isLoadMoreGiftCardsList: false,
    isRefreshingGiftCardsList: false,
    giftCardLogs: [],
    isGiftCardTabPermission: false,
    startProcessingPax: false,
    amountCredtitForSubmitToServer: 0,
    staffListCurrentDate: [],
    visibleAddEditCustomerPopup: false,

    isBookingFromCalendar: false,
    appointmentIdBookingFromCalendar: 0
}

function appointmentReducer(state = initialState, action) {
    switch (action.type) {
        case 'RESET_GROUP_APPOINTMENT':
            return {
                ...initialState,
                staffListCurrentDate: state.staffListCurrentDate,
                groupAppointment: {},
            }

        case 'CHECKOUT_SUBMIT_SUCCESS':
            return {
                ...state,
                paymentDetailInfo: action.payload,
                visiblePopupPaymentDetails: action?.visiblePopupPaymentDetails || false
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
        case 'BOOKING_A_APPOINTMENT_FROM_CALENDAR_SUCCESS':
            return {
                ...state,
                isBookingFromCalendar: action?.isBookingFromCalendar,
                appointmentIdBookingFromCalendar: action?.appointmentIdBookingFromCalendar
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
                paymentDetailInfo: {},
                customerInfoBuyAppointment: {
                    customerId: 0,
                    userId: 0,
                    firstName: "",
                    lastName: "",
                    phone: ""
                },
                isCancelAppointment: false
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
                isDonePayment: false,
                isCancelAppointment: false
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
        case 'VISIBLE_POPUP_ACTIVE_GIFT_CARD':
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
        case 'UPDATE_ID_APPOINTMENT_IS_OPEN':
            return {
                ...state,
                isOpenBlockAppointmentId: action.payload,
            }
        case 'CREATE_BLOCK_APPOINTMENT':
            return {
                ...state,
                fromTimeBlockAppointment: action.fromTimeBlockAppointment,
            }
        case 'UPDATE_FROM_TIME_BLOCK_APPOINTMENT':
            return {
                ...state,
                fromTimeBlockAppointment: action.payload,
            }
        case 'GET_CUSTOMER_INFO_BUY_APPOINTMENT_SUCCESS':
            return {
                ...state,
                customerInfoBuyAppointment: action.payload,
                visibleEnterCustmerPhonePopup: false
            }
        // case 'GET_CUSTOMER_INFO_BUY_APPOINTMENT_FAIL':
        //     return {
        //         ...state,
        //         customerInfoBuyAppointment: action.payload,
        //         visibleEnterCustmerPhonePopup: false
        //     }
        case 'SWITCH_VISIBLE_ENTER_CUSTOMER_PHONE_POPUP':
            return {
                ...state,
                visibleEnterCustmerPhonePopup: action.payload,
            }
        case 'UPDATE_CUSTOMER_ID_BUY_APPOINTMENT':
            return {
                ...state,
                customerInfoBuyAppointment: { ...state.customerInfoBuyAppointment, customerId: action.payload },
            }
        case 'UPDATE_CUSTOMER_INFO_FROM_GET_APPOINTMENT':
            return {
                ...state,
                customerInfoBuyAppointment: action.payload,
            }
        case 'UPDATE_BOOKING_GROUP_ID':
            return {
                ...state,
                bookingGroupId: action.payload,
            }
        case 'GIFT_CARD_PAYMENT_INFO':
            return {
                ...state,
                giftcardPaymentInfo: action.payload,
            }
        case 'TOGGLE_POPUP_GIFT_CARD_PAYMENT_DETAIL':
            return {
                ...state,
                visiblePopupGiftCardDetails: action.payload,
            }
        case 'SWITCH_POPUP_GIFT_CARD_ENTER_AMOUNT':
            return {
                ...state,
                visiblePopupGiftCardEnterAmount: action.payload,
            }
        case "SAVE_GIFT_CARD_ACTION_INFO":
            return {
                ...state,
                addGiftCardInfoAction: action.addGiftCardInfoAction,
                isUpdateQuantityOfGiftCard: true
            }
        case "UPDATE_QUANTITY_OF_GIFT_CARD":
            return {
                ...state,
                isUpdateQuantityOfGiftCard: action.payload,
            }
        case "GET_GIFT_CARDS_ACTIVE_LIST":
            return {
                ...state,
                isLoadMoreGiftCardsList: action.isShowLoadMore,
                isRefreshingGiftCardsList: action.isRefreshingGiftCardsList
            }
        case "GET_GIFT_CARDS_ACTIVE_LIST_SUCCESS":
            return {
                ...state,
                giftCardsList: action?.currentPage === 1 ? action.payload : state.giftCardsList.concat(action.payload),
                totalGiftCardsListPages: action?.totalPages || 1,
                currentGiftCardsListPage: action?.currentPage || 1,
                isLoadMoreGiftCardsList: false,
                isRefreshingGiftCardsList: false
            }
        case "GET_GIFT_CARDS_ACTIVE_LIST_FAIL":
            return {
                ...state,
                isLoadMoreGiftCardsList: false,
                isRefreshingGiftCardsList: false
            }
        case "GET_GIFT_CARDS_LOGS_SUCCESS":
            return {
                ...state,
                giftCardLogs: action.payload,
            }
        case "SWITCH_GIFT_CARD_TAB_PERMISSION":
            return {
                ...state,
                isGiftCardTabPermission: action.payload,
            }
        // ------- New code ------
        case 'CHECK_CREDIT_PAYMENT_TO_SERVER':
            return {
                ...state,
                paxAmount: action?.paxAmount || 0,
                amountCredtitForSubmitToServer: action?.moneyUserGiveForStaff || 0
            }
        case 'CHECK_CREDIT_PAYMENT_TO_SERVER_SUCCESS':
            return {
                ...state,
                payAppointmentId: action.payload,
                startProcessingPax: true,
            }
        case 'CHECK_CREDIT_PAYMENT_TO_SERVER_FAIL':
            return {
                ...state,
                payAppointmentId: 0,
                startProcessingPax: false
            }
        case 'RESET_STATE_CHECK_CREDIT_PAYMENT_TO_SERVER':
            return {
                ...state,
                startProcessingPax: false
            }
        case 'RESET_STATE_CHECK_CREDIT_PAYMENT_TO_SERVER':
            return {
                ...state,
                startProcessingPax: false
            }
        case 'GET_STAFF_LIST_BY_CURRENT_DATE_SUCCESS':
            return {
                ...state,
                staffListCurrentDate: action.payload
            }
        case 'SWITCH_VISIBLE_ADD_EDIT_CUSTOMER_POPUP':
            return {
                ...state,
                visibleAddEditCustomerPopup: action.payload
            }
        case 'LOGOUT_APP':
            return {
                ...initialState,
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
    return {
        data: temptBlockAppointments,
        indexExist
    };
}


module.exports = persistReducer({
    key: "appointment",
    storage: AsyncStorage,
    whitelist: ["staffListCurrentDate"]
}, appointmentReducer);

