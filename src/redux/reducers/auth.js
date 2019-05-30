const initialState = {
    errorLogin: ''
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_APP_SUCCESS':
            return {
                ...state,
                errorLogin: ''
            }
        case 'LOGIN_APP_FAIL':
            return {
                ...state,
                errorLogin: action.payload.message
            }
        default:
            return state
    }
}

module.exports = appReducer;
