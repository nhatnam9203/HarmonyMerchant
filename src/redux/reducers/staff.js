import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    listStaffByMerchant: [],
    listSearchStaff: [],
    isAddStaff: false,
    isShowSearch: false,
    refreshListStaffs: false,
    isResetInfoAdmin: false,
    isGetListSearchStaff: false,
    visibleForotPin: false,
    isShowButtonEnterPinCode: false,
    listStaffsSalary: [],
    refreshListStaffsSalary: false,

}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'REHYDRATE_STAFFS':
            return {
                ...initialState,
                listStaffByMerchant: action.payload
            }
        case 'LOGIN_STAFF':
            return {
                ...state,
                isShowButtonEnterPinCode: true
            }
        case 'LOGIN_STAFF_SUCCESS':
            return {
                ...state,
                isShowButtonEnterPinCode: false
            }
        case 'LOGIN_STAFF_FAIL':
            return {
                ...state,
                isShowButtonEnterPinCode: false
            }
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
        case 'RESET_VISIBLE_FORGOT_PIN':
            return {
                ...state,
                visibleForotPin: action.payload
            }
        case 'UPDATE_STAFFS_POSITION_LOCAL':
            return {
                ...state,
                listStaffByMerchant: action.payload
            }
        case 'GET_LIST_STAFFS_SALARY_TOP':
            return {
                ...state,
                refreshListStaffsSalary: !action.isShowLoading
            }
        case 'GET_LIST_STAFFS_SALARY_TOP_SUCCESS':
            return {
                ...state,
                listStaffsSalary: action.payload,
                refreshListStaffsSalary: false
            }
        case 'GET_LIST_STAFFS_SALARY_TOP_FAIL':
            return {
                ...state,
                refreshListStaffsSalary: false
            }

        default:
            return state
    }
}

const persistConfig = {
    key: 'staff',
    storage: AsyncStorage,
    whitelist: ['listStaffByMerchant']
};

module.exports = persistReducer(persistConfig, appReducer);
