const initialState = {
    listStaffByMerchant: [],
    listSearchStaff: [],
    isAddStaff: false,
    isShowSearch: false
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
        case 'CLEAR_SEARCH':
            return {
                ...state,
                isShowSearch: false
            }
        case 'SEARCH_STAFF_BY_NAME_SUCCESS':
            return {
                ...state,
                listSearchStaff: action.payload,
                isShowSearch: true
            }
        default:
            return state
    }
}

module.exports = appReducer;
