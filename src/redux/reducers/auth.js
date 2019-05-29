const initialState = {
    test: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'TEST_SUCCESS':
            return {
                ...state,
                test: true
            }
        default:
            return state
    }
}

module.exports = appReducer;
