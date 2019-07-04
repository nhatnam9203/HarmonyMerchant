const initialState = {
    categoriesByMerchant: [],

    refreshListCategories: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_CATEGORIES_BY_MERCHANR_ID':
            return {
                ...state,
                refreshListCategories: !action.isShowLoading
            }
        case 'GET_CATEGORIES_BY_MERCHANR_ID_SUCCESS':
            return {
                ...state,
                categoriesByMerchant: action.payload,
                refreshListCategories: false
            }
        case 'GET_CATEGORIES_BY_MERCHANR_ID_FAIL':
            return {
                ...state,
                categoriesByMerchant: action.payload,
                refreshListCategories: false
            }
        default:
            return state
    }
}

module.exports = appReducer;
