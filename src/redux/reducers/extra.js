const initialState = {
    extrasByMerchant: [],
    refreshListExtras: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_EXTRA_BY_MERCHANT':
            return {
                ...state,
                refreshListExtras: !action.isShowLoading
            }
        case 'GET_EXTRA_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                extrasByMerchant: action.payload,
                refreshListExtras: false
            }
        case 'GET_EXTRA_BY_MERCHANT_FAIL':
            return {
                ...state,
                refreshListExtras: false
            }
        default:
            return state
    }
}

module.exports = appReducer;
