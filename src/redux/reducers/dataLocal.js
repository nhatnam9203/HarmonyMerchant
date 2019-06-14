const initialState = {
    profile: {},
    token: "",
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
        default:
            return state
    }
}

module.exports = dataLocal;

