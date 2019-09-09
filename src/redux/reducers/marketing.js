const initialState = {
    listBanners: [],
    isUploadBanner: false,
    promotions: []
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

        default:
            return state
    }
}

module.exports = appReducer;
