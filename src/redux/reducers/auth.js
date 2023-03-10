import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  errorLogin: null,
  isLoadingCheckStaffPermission: false,
  visiblePopupCheckStaffPermission: false,
  errorLoginReport: null,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_APP_SUCCESS":
      return {
        ...state,
        errorLogin: null,
      };
    case "LOGIN_APP_FAIL":
      return {
        ...state,
        errorLogin: action?.payload?.message || null,
      };
    case "LOGIN_REPORT_SERVER_SUCCESS":
      return {
        ...state,
        errorLoginReport: null,
      };
    case "LOGIN_REPORT_SERVER_FAIL":
      return {
        ...state,
        errorLoginReport: action?.payload?.message || null,
      };
    case "CHECK_STAFF_PERMISSION":
      return {
        ...state,
        isLoadingCheckStaffPermission: true,
      };
    case "CHECK_STAFF_PERMISSION_SUCCESS":
      return {
        ...state,
        isLoadingCheckStaffPermission: false,
      };
    case "CHECK_STAFF_PERMISSION_FAIL":
      return {
        ...state,
        isLoadingCheckStaffPermission: false,
      };
    case "TOGGLE_VISIBLE_POPUP_CHECK_STAFF_PERMISSION":
      return {
        ...state,
        visiblePopupCheckStaffPermission: action.payload,
      };
    case "LOGOUT_APP":
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

module.exports = persistReducer({
    key: "auth",
    storage: AsyncStorage,
    whitelist: []
}, authReducer);

// export default authReducer;
