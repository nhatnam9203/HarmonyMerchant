const initialState = {
    servicesByMerchant: [],
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_SERVICE_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                servicesByMerchant: action.payload
            }
        default:
            return state
    }
}

module.exports = appReducer;
