const initialState = {
    profile: {},
    token: false,
    stateCity: [],
    language: 'en'
}

function dataLocal(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_PROFILE_LOCAL':
            return {
                ...state,
                profile: action.payload.profile,
                token: action.payload.token,
            }
        case 'CHANGE_LANGUAGE_APP':
            return {
                ...state,
                language: action.payload,
            }
        case 'GET_STATE_CITY_SUCCESS':
            return {
                ...state,
                stateCity: action.payload
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

