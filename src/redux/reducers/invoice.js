import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    listInvoicesByMerchant: [],
    totalPages: 0,
    currentPage: 0,
    refreshListInvoice: false,
    listInvoicesSearch: [],
    isShowSearchInvoice: false,
    settleWaiting: {},
    invoicesOfStaff: [],
    transactionsSettlement: [],
    // ----- Search transaction ------
    listTransactionSearch: [],
    isShowSearchTransaction: false,

    listBatchHistory: [],
    listBatchHistorySearch: [],
    isShowSearchBatchHistory: false,


    refreshingSettle: false,
    refreshingTransaction: false,
    refreshingBatchHistory: false

}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_INVOICES':
            return {
                ...initialState,
                listInvoicesByMerchant: action.payload
            }
        case 'GET_TRANSACTION_SETTLEMENT':
            return {
                ...state,
                refreshingTransaction: !action.isShowLoading
            }
        case 'GET_LIST_INVOICE_BY_MERCHANT':
            return {
                ...state,
                refreshListInvoice: !action.isShowLoading,
            }
        case 'GET_LIST_INVOICE_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                listInvoicesByMerchant: action.currentPage === 1 ? action.payload : state.listInvoicesByMerchant.concat(action.payload),
                totalPages: action.totalPages,
                currentPage: action.currentPage,
                refreshListInvoice: false
            }
        case 'GET_LIST_INVOICE_BY_MERCHANT_FAIL':
            return {
                ...state,
                refreshListInvoice: false
            }
        case 'SEARCH_INVOICE_SUCCESS':
            return {
                ...state,
                listInvoicesSearch: action.payload,
                isShowSearchInvoice: true
            }
        case 'CLEAR_SEARCH_SERVICE':
            return {
                ...state,
                listInvoicesSearch: [],
                isShowSearchInvoice: false
            }
        case 'GET_SETTLEMENT_WAITING':
            return {
                ...state,
                refreshingSettle: !action.isShowLoading,
            }
        case 'GET_SETTLEMENT_WAITING_SUCCESS':
            return {
                ...state,
                settleWaiting: action.payload,
                refreshingSettle: false,
            }
        case 'GET_SETTLEMENT_WAITING_FAIL':
            return {
                ...state,
                refreshingSettle: false,
            }
        case 'RESET_SETTLE':
            return {
                ...state,
                refreshingSettle: false,
                settleWaiting: {}
            }
        case 'INVOICE_OFF_STAFF_SUCCESS':
            return {
                ...state,
                invoicesOfStaff: action.payload,
            }
        case 'GET_TRANSACTION_SETTLEMENT_SUCCESS':
            return {
                ...state,
                transactionsSettlement: action.payload,
                refreshingTransaction: false
            }
        case 'GET_TRANSACTION_SETTLEMENT_FAIL':
            return {
                ...state,
                refreshingTransaction: false
            }
        case 'SEARCH_TRANSACTION_SETTLEMENT_SUCCESS':
            return {
                ...state,
                listTransactionSearch: action.payload,
                isShowSearchTransaction: true,
            }
        case 'CLEAR_SEARCH_TRANSACTION':
            return {
                ...state,
                listTransactionSearch: [],
                isShowSearchTransaction: false
            }
        case 'GET_BATCH_HISTORY':
            return {
                ...state,
                refreshingBatchHistory: !action.isShowLoading
            }
        case 'GET_BATCH_HISTORY_SUCCESS':
            return {
                ...state,
                listBatchHistory: action.payload,
                refreshingBatchHistory: false
            }
        case 'GET_BATCH_HISTORY_FAIL':
            return {
                ...state,
                refreshingBatchHistory: false
            }
        case 'SEARCH_BATCH_HISTORY_SUCCESS':
            return {
                ...state,
                listBatchHistorySearch: action.payload,
                isShowSearchBatchHistory: true
            }
        case 'CLEAR_SEARCH_BATCH_HISTORRY':
            return {
                ...state,
                listBatchHistorySearch: [],
                isShowSearchBatchHistory: false
            }
        default:
            return state
    }
}

const persistConfig = {
    key: 'invoice',
    storage: AsyncStorage,
    whitelist: ['listInvoicesByMerchant']
};

module.exports = persistReducer(persistConfig, appReducer);
