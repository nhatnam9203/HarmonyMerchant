import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    listCustomersByMerchant: [],
    listCustomersSearch: [],
    isShowSearchCustomer: false,
    refreshListCustomer: false,
    customerTabPermission: false,
    pastAppointments: [],
    totalPages: 0,
    currentPage: 0,
    isLoadMoreCustomerList: false,
    customerInfoById: {},
    customerHistory: {},
    isGetCustomerInfoByIdSuccess: false,
    totalPastAppointmentPages: 0,
    currentPastAppointmentPage: 0,
    isLoadMorePastAppointment: false
}

function customerReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_LIST_CUSTOMER_BY_MERCHANT':
            return {
                ...state,
                refreshListCustomer: !action.isShowLoading,
                isLoadMoreCustomerList: action?.isShowLoadMore
            }
        case 'GET_LIST_CUSTOMER_BY_MERCHANT_FAIL':
            return {
                ...state,
                refreshListCustomer: false,
                isLoadMoreCustomerList: false
            }
        case 'SEARCH_CUSTOMER_SUCCESS':
            return {
                ...state,
                listCustomersSearch: action.payload,
                isShowSearchCustomer: true
            }
        case 'CLEAR_SEARCH_CUSTOMER':
            return {
                ...state,
                listCustomersSearch: [],
                isShowSearchCustomer: false
            }
        case 'NET_WORK_REQUEST_FAIL':
            return {
                ...state,
                refreshListCustomer: false
            }
        case 'TIME_OUT':
            return {
                ...state,
                refreshListCustomer: false
            }
        case 'TOGGLE_CUSTOMER_TAB_PERMISSION':
            return {
                ...state,
                customerTabPermission: action.payload
            }
        case 'CLOSE_ALL_POPUP_PIN_CODE':
            return {
                ...state,
                customerTabPermission: false,
            }
        case 'GET_CUSTOMER_INFO_BY_ID':
            return {
                ...state,
                isGetCustomerInfoByIdSuccess: false,
            }
        case 'GET_CUSTOMER_INFO_BY_ID__SUCCESS':
            return {
                ...state,
                customerInfoById: { ...action?.payload, customerHistory: null },
                customerHistory: action?.payload?.customerHistory,
                isGetCustomerInfoByIdSuccess: true
            }
        case 'RESET_IS_GET_CUSTOMER_INFO_BY_ID_STATE':
            return {
                ...state,
                isGetCustomerInfoByIdSuccess: false,
            }
        case 'GET_LIST_CUSTOMER_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                listCustomersByMerchant: action.currentPage === 1 ? action.payload : state.listCustomersByMerchant.concat(action.payload),
                totalPages: action.totalPages,
                currentPage: action.currentPage,
                refreshListCustomer: false,
                isLoadMoreCustomerList: false
            }
        case 'GET_PAST_APPOINTMENT':
            return {
                ...state,
                isLoadMorePastAppointment: action?.isShowLoadMore
            }
        case 'GET_PAST_APPOINTMENT_SUCCESS':
            return {
                ...state,
                pastAppointments: action?.currentPastAppointmentPage === 1 ? action.payload : state.pastAppointments.concat(action.payload),
                totalPastAppointmentPages: action?.totalPastAppointmentPages || 1,
                currentPastAppointmentPage: action?.currentPastAppointmentPage || 1,
                isLoadMorePastAppointment: false
            }
        case 'GET_PAST_APPOINTMENT_FAIL':
            return {
                ...state,
                isLoadMorePastAppointment: false
            }
        case 'LOGOUT_APP':
            return {
                ...initialState,
            }
        default:
            return state
    }
}

module.exports = persistReducer({
    key: 'customer',
    storage: AsyncStorage,
    whitelist: ['listCustomersByMerchant']
}, customerReducer);

