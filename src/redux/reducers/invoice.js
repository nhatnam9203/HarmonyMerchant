const initialState = {
    listInvoicesByMerchant: [],
    refreshListInvoice:false
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
        

        default:
            return state
    }
}

module.exports = appReducer;
