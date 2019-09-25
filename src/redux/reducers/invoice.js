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

}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_LIST_INVOICE_BY_MERCHANT':
            return {
                ...state,
                refreshListInvoice: !action.isShowLoading
            }
        case 'GET_LIST_INVOICE_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                listInvoicesByMerchant: action.currentPage === 1 ? action.payload :state.listInvoicesByMerchant.concat(action.payload),
                // listInvoicesByMerchant: action.payload ,
                totalPages: action.totalPages,
                currentPage: action.currentPage,
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
        case 'GET_SETTLEMENT_WAITING_SUCCESS':
            return {
                ...state,
                settleWaiting: action.payload,
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
        case 'GET_BATCH_HISTORY_SUCCESS':
            return {
                ...state,
                listBatchHistory: action.payload,
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

module.exports = appReducer;
