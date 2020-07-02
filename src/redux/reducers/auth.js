const initialState = {
    errorLogin: '',
    isLoadingCheckStaffPermission : false
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
        case 'CHECK_STAFF_PERMISSION':
            return {
                ...state,
                isLoadingCheckStaffPermission: true
            }
        case 'CHECK_STAFF_PERMISSION_SUCCESS':
            return {
                ...state,
                isLoadingCheckStaffPermission: false
            }
        case 'CHECK_STAFF_PERMISSION_FAIL':
            return {
                ...state,
                isLoadingCheckStaffPermission: false
            }
        default:
            return state
    }
}

module.exports = appReducer;
