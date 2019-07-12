const initialState = {
    extrasByMerchant: [],
    refreshListExtras: false,
    listExtrasSearch: [],
    isShowSearchExtra: false,
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
        case 'SEARCH_EXTRA_SUCCESS':
            return {
                ...state,
                listExtrasSearch: action.payload,
                isShowSearchExtra: true
            }
        case 'CLEAR_SEARCH_EXTRA':
            return {
                ...state,
                listExtrasSearch: [],
                isShowSearchExtra: false
            }
        default:
            return state
    }
}

module.exports = appReducer;
