const initialState = {
    categories:[],
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_LIST_CATEGORY_SUCCESS':
            return {
                ...state,
                categories: []
            }
        default:
            return state
    }
}

module.exports = appReducer;
