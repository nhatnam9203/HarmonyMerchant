import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  listStaffByMerchant: [],
  listSearchStaff: [],
  isAddStaff: false,
  isShowSearchStaff: false,
  refreshListStaffs: false,
  isResetInfoAdmin: false,
  isGetListSearchStaff: false,
  visibleForotPin: false,
  isShowButtonEnterPinCode: false,
  listStaffsSalary: [],
  refreshListStaffsSalary: false,
  dx: 0,
  reportTabPermission: false,
  isDownloadReportStaff: false,
  pathFileReportStaffSalary: null,
  pathFileReportStaffStatistic: null,
  reportTabPermissionSuccess: false,

  isShowSearchResult: false
};

function staffReducer(state = initialState, action) {
  switch (action.type) {
    // case "REHYDRATE_STAFFS":
    //   return {
    //     ...initialState,
    //     listStaffByMerchant: action.payload,
    //   };
    case "LOGIN_STAFF":
      return {
        ...state,
        isShowButtonEnterPinCode: true,
      };
    case "LOGIN_STAFF_SUCCESS":
      return {
        ...state,
        isShowButtonEnterPinCode: false,
      };
    case "LOGIN_STAFF_FAIL":
      return {
        ...state,
        isShowButtonEnterPinCode: false,
      };
    case "GET_STAFF_BY_MERCHANR_ID":
      return {
        ...state,
        refreshListStaffs: !action.isShowLoading,
      };
    case "GET_STAFF_BY_MERCHANR_ID_SUCCESS":
      return {
        ...state,
        listStaffByMerchant: !action.searchFilter ? action.payload : state.listStaffByMerchant,
        listSearchStaff: action.searchFilter ? action.payload : state.listSearchStaff,
        isShowSearchStaff: action.searchFilter,
        refreshListStaffs: false,
      };
    case "GET_STAFF_BY_MERCHANR_ID_FAIL":
      return {
        ...state,
        refreshListStaffs: false,
      };
    case "SWICH_ADD_STAFF":
      return {
        ...state,
        isAddStaff: action.payload,
      };
    case "CLEAR_SEARCH":
      return {
        ...state,
        isShowSearchStaff: false,
        listSearchStaff: [],
      };
    case "SEARCH_STAFF_BY_NAME_SUCCESS":
      return {
        ...state,
        listSearchStaff: action.payload,
        isShowSearchStaff: true,
        isGetListSearchStaff: false,
      };
    case "RESET_INFO_ADMIN":
      return {
        ...state,
        isResetInfoAdmin: true,
      };
    case "SET_FLAG_RESET_INFO_ADMIN": {
      return {
        ...state,
        isResetInfoAdmin: false,
      };
    }
    case "NET_WORK_REQUEST_FAIL":
      return {
        ...state,
        refreshListStaffs: false,
      };
    case "TIME_OUT":
      return {
        ...state,
        refreshListStaffs: false,
      };
    case "IS_GET_LIST_SEARCH_STAFF":
      return {
        ...state,
        isGetListSearchStaff: true,
      };
    case "RESET_VISIBLE_FORGOT_PIN":
      return {
        ...state,
        visibleForotPin: action.payload,
      };
    case "UPDATE_STAFFS_POSITION_LOCAL":
      return {
        ...state,
        listStaffByMerchant: action.payload,
      };
    case "GET_LIST_STAFFS_SALARY_TOP":
      return {
        ...state,
        refreshListStaffsSalary: !action.isShowLoading,
      };
    case "GET_LIST_STAFFS_SALARY_TOP_SUCCESS":
      return {
        ...state,
        listStaffsSalary: action.payload,
        refreshListStaffsSalary: false,
      };
    case "GET_LIST_STAFFS_SALARY_TOP_FAIL":
      return {
        ...state,
        refreshListStaffsSalary: false,
      };
    case "ON_SCROLL":
      return {
        ...state,
        dx: action.payload,
      };
    case "TOGGLE_REPORT_TAB_PERMISSION":
      return {
        ...state,
        reportTabPermission: action.payload,
        reportTabPermissionSuccess: false,
      };
    case "TOGGLE_REPORT_TAB_PERMISSION_SUCCESS":
      return {
        ...state,
        reportTabPermissionSuccess: true,
      };
    case "CLOSE_ALL_POPUP_PIN_CODE":
      return {
        ...state,
        reportTabPermission: false,
        reportTabPermissionSuccess: false,
      };
    case "DOWNLOAD_REPORT_STAFF":
      return {
        ...state,
        isDownloadReportStaff: true,
      };
    case "DOWNLOAD_REPORT_STAFF_SALARY_SUCCESS":
      return {
        ...state,
        pathFileReportStaffSalary: action.payload,
        isDownloadReportStaff: false,
      };
    case "DOWNLOAD_REPORT_STAFF_STATISTIC_SUCCESS":
      return {
        ...state,
        pathFileReportStaffStatistic: action.payload,
        isDownloadReportStaff: false,
      };
    case "RESET_DOWNLOAD_FILE_REPORT_STAFF":
      return {
        ...state,
        isDownloadReportStaff: false,
        pathFileReportStaffStatistic: null,
      };
      case 'LOGOUT_APP':
        return {
          ...initialState,
        }
    default:
      return state;
  }
}

// const persistConfig = {
//   key: "staff",
//   storage: AsyncStorage,
//   whitelist: ["listStaffByMerchant"],
// };

// module.exports = persistReducer(persistConfig, appReducer);

module.exports = persistReducer({
  key: "staff",
  storage: AsyncStorage,
  whitelist: ["listStaffByMerchant"],
}, staffReducer);

