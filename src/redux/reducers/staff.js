const initialState = {
    listStaffByMerchant: [],
    listSearchStaff: [],
    isAddStaff: false,
    isShowSearch: false,
    refreshListStaffs: false,
    isResetInfoAdmin: false,
    isGetListSearchStaff: false

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
                isShowSearch: true,
                isGetListSearchStaff: false
            }
        case 'RESET_INFO_ADMIN':
            return {
                ...state,
                isResetInfoAdmin: true
            }
        case 'SET_FLAG_RESET_INFO_ADMIN': {
            return {
                ...state,
                isResetInfoAdmin: false
            }
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
        case 'IS_GET_LIST_SEARCH_STAFF':
            return {
                ...state,
                isGetListSearchStaff: true
            }


        default:
            return state
    }
}

module.exports = appReducer;
