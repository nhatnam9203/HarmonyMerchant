const initialState = {
    loading: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOADING_ROOT':
            return {
                ...state,
                loading: true
            }
        case 'STOP_LOADING_ROOT':
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}

module.exports = appReducer;
