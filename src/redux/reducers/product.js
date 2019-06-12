const initialState = {
    productsByMerchantId: [],
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_PRODUCTS_BY_MERCHANR_ID_SUCCESS':
            return {
                ...state,
                productsByMerchantId: action.payload
            }
        default:
            return state
    }
}

module.exports = appReducer;
