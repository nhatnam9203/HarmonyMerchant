const initialState = {
    isUpload: false,
    dataUpload : {}
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPLOAD_AVATAR_SUCCESS':
            return {
                ...state,
                isUpload: true,
                dataUpload: action.payload
            }
        case 'UPLOAD_AVATAR_FAIL':
            return {
                ...state,
                isUpload: false
            }
        default:
            return state
    }
}

module.exports = appReducer;
