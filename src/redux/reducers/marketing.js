const initialState = {
    listBanners: [],
    isUploadBanner: false
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
        default:
            return state
    }
}

module.exports = appReducer;
