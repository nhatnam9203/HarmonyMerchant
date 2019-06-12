const initialState = {
    profile: {},
    token: ""
}

function dataLocal(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_PROFILE_LOCAL':
            return {
                ...state,
                profile: action.payload.profile,
                token: action.payload.token,
            }
        default:
            return state
    }
}

module.exports = dataLocal;

