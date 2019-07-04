const initialState = {
    productsByMerchantId: [],
    listProductsSearch: [],
    isShowSearchProduct: false,
    refreshListProducts: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_PRODUCTS_BY_MERCHANR_ID':
            return {
                ...state,
                refreshListProducts: !action.isShowLoading
            }
        case 'GET_PRODUCTS_BY_MERCHANR_ID_SUCCESS':
            return {
                ...state,
                productsByMerchantId: action.payload,
                refreshListProducts: false
            }
        case 'GET_PRODUCTS_BY_MERCHANR_ID_FAIL':
            return {
                ...state,
                refreshListProducts: false
            }
        case 'SEARCH_PRODUCT_SUCCESS':
            return {
                ...state,
                listProductsSearch: action.payload,
                isShowSearchProduct: true
            }
        case 'CLEAR_SEARCH_PRODUCT':
            return {
                ...state,
                listProductsSearch: [],
                isShowSearchProduct: false
            }
        default:
            return state
    }
}

module.exports = appReducer;
