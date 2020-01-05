const initialState = {
    isOfflineMode: true
}

function networkReducer(state = initialState, action) {
    switch (action.typeNetwork) {
        case 'IS_CONNECTED_INTERNET':
            return {
                ...state,
                // isOfflineMode: false
            }
        case 'TURN_ON_OFFLINE_MODE':
            return {
                ...state,
                isOfflineMode: action.payload,
            }
        case 'NET_WORK_REQUEST_FAIL':
            return {
                ...state,
                isOfflineMode: true
            }
        default:
            return state
    }
}

module.exports = networkReducer;
