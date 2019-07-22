const initialState = {
    listCustomersByExtra:[]
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_LIST_CUSTOMER_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                listCustomersByExtra: action.payload
            }
        default:
            return state
    }
}

module.exports = appReducer;
