const initialState = {
    servicesByMerchant: [],
    listServicesSearch: [],
    isShowSearchService: false,
    refreshListServices: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_SERVICE_BY_MERCHANT':
            return {
                ...state,
                refreshListServices: !action.isShowLoading
            }
        case 'GET_SERVICE_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                servicesByMerchant: action.payload,
                refreshListServices: false
            }
        case 'GET_SERVICE_BY_MERCHANT_FAIL':
            return {
                ...state,
                refreshListServices: false
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
            case 'NET_WORK_REQUEST_FAIL':
                return {
                    ...state,
                    refreshListServices: false
                }
            case 'TIME_OUT':
                return {
                    ...state,
                    refreshListServices: false
                }
        default:
            return state
    }
}

module.exports = appReducer;
