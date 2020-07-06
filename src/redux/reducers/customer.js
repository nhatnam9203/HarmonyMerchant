import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    listCustomersByMerchant: [],
    listCustomersSearch: [],
    isShowSearchCustomer: false,
    refreshListCustomer: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_CUSTOMERS':
            console.log("REHYDRATE_CUSTOMERS : ",action.payload);
            return {
                ...state,
                listCustomersByMerchant: action.payload
            }
        case 'GET_LIST_CUSTOMER_BY_MERCHANT':
            return {
                ...state,
                refreshListCustomer: !action.isShowLoading
            }
        case 'GET_LIST_CUSTOMER_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                listCustomersByMerchant: action.payload,
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

        default:
            return state
    }
}

const persistConfig = {
    key: 'customer',
    storage: AsyncStorage,
    whitelist: ['listCustomersByMerchant']
};

module.exports = persistReducer(persistConfig, appReducer);
