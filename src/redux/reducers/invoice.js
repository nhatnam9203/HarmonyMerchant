const initialState = {
    listInvoicesByMerchant: [],
   
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_LIST_INVOICE_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                listInvoicesByMerchant: action.payload
            }
        

        default:
            return state
    }
}

module.exports = appReducer;
