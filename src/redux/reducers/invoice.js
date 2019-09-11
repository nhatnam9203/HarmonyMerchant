const initialState = {
    listInvoicesByMerchant: [],
    refreshListInvoice: false,
    listInvoicesSearch: [],
    isShowSearchInvoice: false,
    settleWaiting: {}
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
                listInvoicesByMerchant: action.payload,
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
        default:
            return state
    }
}

module.exports = appReducer;
