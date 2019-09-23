const initialState = {
    isUpload: false,
    dataUpload: {}
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
                isUpload: false,
                dataUpload: false
            }
        case 'RESET_STATE_UPLOAD':
            return {
                ...state,
                isUpload: false,
                dataUpload: {}
            }

        default:
            return state
    }
}

module.exports = appReducer;
