const initialState = {
    listCustomersByMerchant: [],
    listCustomersSearch: [],
    isShowSearchCustomer: false,
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_LIST_CUSTOMER_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                listCustomersByMerchant: action.payload
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

        default:
            return state
    }
}

module.exports = appReducer;
