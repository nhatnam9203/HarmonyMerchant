const initialState = {
    categoriesByMerchant: [],
    refreshListCategories: false,
    listCategoriesSearch: [],
    isShowSearchCategories: false,
    isGetListSearchCategories:false
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
        case 'SEARCH_CATEGORIES_SUCCESS':
            return {
                ...state,
                listCategoriesSearch: action.payload,
                isShowSearchCategories: true,
                isGetListSearchCategories:false
            }
        case 'CLEAR_SEARCH_CATEGORIES':
            return {
                ...state,
                listCategoriesSearch: [],
                isShowSearchCategories: false
            }
        case 'NET_WORK_REQUEST_FAIL':
            return {
                ...state,
                refreshListCategories: false
            }
        case 'TIME_OUT':
            return {
                ...state,
                refreshListCategories: false
            }
        case 'IS_GET_LIST_SEARCH_CATEGORIES':
            return {
                ...state,
                isGetListSearchCategories: true
            }

        default:
            return state
    }
}

module.exports = appReducer;
