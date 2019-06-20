const initialState = {
    listStaffByMerchant: [],
    listSearchStaff: [],
    isAddStaff: false
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_STAFF_BY_MERCHANR_ID_SUCCESS':
            return {
                ...state,
                listStaffByMerchant: action.payload
            }
        case 'SWICH_ADD_STAFF':
            return {
                ...state,
                isAddStaff: action.payload
            }
        case 'SEARCH_STAFF_BY_NAME':
            return {
                ...state,
                listSearchStaff: action.payload
            }
        default:
            return state
    }
}

module.exports = appReducer;
