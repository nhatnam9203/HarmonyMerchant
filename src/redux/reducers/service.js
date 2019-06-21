const initialState = {
    servicesByMerchant: [],
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_CATEGORIES_BY_MERCHANR_ID_SUCCESS':
            return {
                ...state,
                servicesByMerchant: action.payload
            }
        default:
            return state
    }
}

module.exports = appReducer;
