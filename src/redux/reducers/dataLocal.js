const initialState = {
    profile: {},
    token: false,
    stateCity: [],
    language: 'en',
    autoCloseAt: '',
    autoLockScreenAfter: ''
}

function dataLocal(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_PROFILE_LOCAL':
            return {
                ...state,
                profile: action.payload.profile,
                token: action.payload.token,
            }
        case 'CHANGE_SETTING_LOCAL_APP':
            return {
                ...state,
                language: action.payload.language,
                autoCloseAt:action.payload.autoCloseAt,
                autoLockScreenAfter:action.payload.autoLockScreenAfter,
            }
        case 'GET_STATE_CITY_SUCCESS':
            return {
                ...state,
                stateCity: action.payload
            }
        case 'UPDATE_MERCHANT_PROFILE':
            return {
                 ...state,
                profile: action.payload
            }
        case 'LOGOUT_APP':
            return {
                ...state,
                profile: {},
                token: false,
            }
        default:
            return state
    }
}

module.exports = dataLocal;

