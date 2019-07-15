const initialState = {
    listStaffByMerchant: [],
    listSearchStaff: [],
    isAddStaff: false,
    isShowSearch: false,
    refreshListStaffs: false

}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_STAFF_BY_MERCHANR_ID':
            return {
                ...state,
                refreshListStaffs: !action.isShowLoading
            }
        case 'GET_STAFF_BY_MERCHANR_ID_SUCCESS':
            return {
                ...state,
                listStaffByMerchant: action.payload,
                refreshListStaffs: false
            }
        case 'GET_STAFF_BY_MERCHANR_ID_FAIL':
            return {
                ...state,
                refreshListStaffs: false
            }
        case 'SWICH_ADD_STAFF':
            return {
                ...state,
                isAddStaff: action.payload
            }
        case 'CLEAR_SEARCH':
            return {
                ...state,
                isShowSearch: false,
                listSearchStaff: []
            }
        case 'SEARCH_STAFF_BY_NAME_SUCCESS':
            return {
                ...state,
                listSearchStaff: action.payload,
                isShowSearch: true
            }
            case 'NET_WORK_REQUEST_FAIL':
                return {
                    ...state,
                    refreshListStaffs: false
                }
            case 'TIME_OUT':
                return {
                    ...state,
                    refreshListStaffs: false
                }
        default:
            return state
    }
}

module.exports = appReducer;
