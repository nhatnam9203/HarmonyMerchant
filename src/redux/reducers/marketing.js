const initialState = {
    listBanners: []
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_BANNER_MERCHANT_SUCCESS':
            return {
                ...state,
                listBanners: action.payload
            }
        default:
            return state
    }
}

module.exports = appReducer;
