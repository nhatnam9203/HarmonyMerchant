import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    listCustomersByMerchant: [],
    listCustomersSearch: [],
    isShowSearchCustomer: false,
    refreshListCustomer: false,
    customerTabPermission: false,
    customerInfoById: {},
    pastAppointments:[],
    totalPages: 0,
    currentPage: 0,
}

function customerReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_LIST_CUSTOMER_BY_MERCHANT':
            return {
                ...state,
                refreshListCustomer: !action.isShowLoading
            }
        case 'GET_LIST_CUSTOMER_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                listCustomersByMerchant: action.currentPage === 1 ? action.payload : state.listCustomersByMerchant.concat(action.payload),
                totalPages: action.totalPages,
                currentPage: action.currentPage,
                refreshListCustomer: false
            }
        case 'GET_LIST_CUSTOMER_BY_MERCHANT_FAIL':
            return {
                ...state,
                refreshListCustomer: false
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
        case 'GET_CUSTOMER_INFO_BY_ID__SUCCESS':
            return {
                ...state,
                customerInfoById: action.payload,
            }
        case 'GET_PAST_APPOINTMENT_SUCCESS':
            return {
                ...state,
                pastAppointments: action.payload,
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

