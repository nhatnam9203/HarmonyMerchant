const initialState = {
    extrasByMerchant: [],
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_EXTRA_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                extrasByMerchant: action.payload
            }
        default:
            return state
    }
}

module.exports = appReducer;
