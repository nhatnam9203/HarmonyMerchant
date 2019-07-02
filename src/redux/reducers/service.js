const initialState = {
    servicesByMerchant: [],
    listServicesSearch: [],
    isShowSearchService: false,
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_SERVICE_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                servicesByMerchant: action.payload
            }
        case 'SEARCH_SERVICE_SUCCESS':
            return {
                ...state,
                listServicesSearch: action.payload,
                isShowSearchService: true
            }
        case 'CLEAR_SEARCH_SERVICE':
            return {
                ...state,
                listServicesSearch: [],
                isShowSearchService: false
            }


        default:
            return state
    }
}

module.exports = appReducer;
