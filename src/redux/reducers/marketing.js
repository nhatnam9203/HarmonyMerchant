const initialState = {
    listBanners: [],
    isUploadBanner: false,
    promotions: [],
    discount: [],
    visibleModalDiscount: false,
    isApplyPromotion: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_BANNER_MERCHANT_SUCCESS':
            return {
                ...state,
                listBanners: action.payload,
                isUploadBanner: true
            }
        case 'RESET_STATE_UPLOAD_BANNER':
            return {
                ...state,
                isUploadBanner: false
            }
        case 'GET_PROMOTION_BY_MERCHANT_SUCCESS':
            return {
                ...state,
                promotions: action.payload,
            }
        case 'GET_PROMOTION_BY_APPOINTMENT_SUCCESS':
            return {
                ...state,
                discount: action.payload,
                visibleModalDiscount: true
            }
        case 'CLOSE_MODAL_DISCOUNT':
            return {
                ...state,
                visibleModalDiscount: false,
                discount: [],
            }
        case 'OPEN_MODAL_DISCOUNT':
            return {
                ...state,
                visibleModalDiscount: true,
            }
        case 'SET_STATUS_APPLY_BUTTON':
            return {
                ...state,
                isApplyPromotion: action.payload,
            }
        default:
            return state
    }
}

module.exports = appReducer;
