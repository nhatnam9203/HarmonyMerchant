import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    errorLogin: '',
    isLoadingCheckStaffPermission: false,
    visiblePopupCheckStaffPermission: false
}

function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_APP_SUCCESS':
            return {
                ...state,
                errorLogin: ''
            }
        case 'LOGIN_APP_FAIL':
            return {
                ...state,
                errorLogin: action.payload.message
            }
        case 'CHECK_STAFF_PERMISSION':
            return {
                ...state,
                isLoadingCheckStaffPermission: true
            }
        case 'CHECK_STAFF_PERMISSION_SUCCESS':
            return {
                ...state,
                isLoadingCheckStaffPermission: false,
            }
        case 'CHECK_STAFF_PERMISSION_FAIL':
            return {
                ...state,
                isLoadingCheckStaffPermission: false
            }
        case 'TOGGLE_VISIBLE_POPUP_CHECK_STAFF_PERMISSION':
            return {
                ...state,
                visiblePopupCheckStaffPermission: action.payload
            }

        default:
            return state
    }
}

module.exports = persistReducer({
    key: "auth",
    storage: AsyncStorage,
    whitelist:[]
  }, authReducer);