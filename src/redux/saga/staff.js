import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { Alert } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

import { requestAPI } from "../../utils";
import Configs from "@configs";
import { saveAuthToken } from "@shared/storages/authToken";

function* addStaffByMerchant(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        role: "",
        status: "",
      };
      const { keySearch, role, status } = searchFilter;
      yield put({
        type: "EDIT_STAFF_BY_MERCHANT_SUCCESS",
      });
      yield put({
        type: "GET_STAFF_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `${Configs.API_URL}staff/search?name=${
          keySearch ? keySearch : ""
        }&role=${role ? role : ""}&status=${status ? status : ""}`,
        isShowLoading: true,
        searchFilter: action?.searchFilter || false,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* getStaffByMerchantId(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        role: "",
        status: "",
      };
      const { keySearch, role, status } = searchFilter;
      const tempSearchFilter = keySearch || role || status ? true : false;
      yield put({
        type: "GET_STAFF_BY_MERCHANR_ID_SUCCESS",
        payload: responses.data,
        searchFilter: tempSearchFilter,
      });
      // yield put({
      //   type: "SWICH_ADD_STAFF",
      //   payload: false,
      // });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({ type: "GET_STAFF_BY_MERCHANR_ID_FAIL" });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: "GET_STAFF_BY_MERCHANR_ID_FAIL" });
    yield put({ type: error });
    yield put({ type: "STOP_LOADING_ROOT" });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
    if (action.isCreateAdmin) {
      setTimeout(() => {
        Alert.alert(
          "Great!",
          `You've successfully created your Admin Info`,
          [
            {
              text: "OK",
              onPress: () => {},
            },
          ],
          { cancelable: false }
        );
      }, 200);
    }
  }
}

function* getStaffDetailByMerchantId(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "GET_STAFF_DETAIL_BY_ID_SUCCESS",
        payload: responses?.data || {},
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({ type: "GET_STAFF_DETAIL_MERCHANR_ID_FAIL" });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: "STOP_LOADING_ROOT" });
    yield put({ type: "GET_STAFF_DETAIL_MERCHANR_ID_FAIL" });
    yield put({ type: error });
  }
}

function* searchStaffByName(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "SEARCH_STAFF_BY_NAME_SUCCESS",
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
    yield put({ type: "STOP_LOADING_ROOT" });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* archiveStaff(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        role: "",
        status: "",
      };
      const { keySearch, role, status } = searchFilter;
      yield put({ type: "IS_GET_LIST_SEARCH_STAFF" });
      yield put({
        type: "GET_STAFF_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `${Configs.API_URL}staff/search?name=${
          keySearch ? keySearch : ""
        }&role=${role ? role : ""}&status=${status ? status : ""}`,
        isShowLoading: true,
        searchFilter: action.searchFilter ? action.searchFilter : false,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* restoreStaff(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        role: "",
        status: "",
      };
      const { keySearch, role, status } = searchFilter;
      yield put({ type: "IS_GET_LIST_SEARCH_STAFF" });
      yield put({
        type: "GET_STAFF_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `${Configs.API_URL}staff/search?name=${
          keySearch ? keySearch : ""
        }&role=${role ? role : ""}&status=${status ? status : ""}`,
        isShowLoading: true,
        searchFilter: action?.searchFilter || false,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* createAdmin(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "RESET_INFO_ADMIN",
      });
      yield put({
        type: "GET_STAFF_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `staff`,
        isCreateAdmin: true,
        isShowLoading: true,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* editStaff(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;

    if (parseInt(codeNumber) == 200) {
      const searchFilter = action?.searchFilter || {
        keySearch: "",
        role: "",
        status: "",
      };
      const { keySearch, role, status } = searchFilter;
      yield put({
        type: "EDIT_STAFF_BY_MERCHANT_SUCCESS",
      });
      yield put({
        type: "GET_STAFF_BY_MERCHANR_ID",
        method: "GET",
        token: true,
        api: `${Configs.API_URL}staff/search?name=${
          keySearch ? keySearch : ""
        }&role=${role ? role : ""}&status=${status ? status : ""}`,
        isShowLoading: true,
        searchFilter: action?.searchFilter || false,
      });
      yield put({
        type: "RESET_NEED_SETTING_STORE",
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: "STOP_LOADING_ROOT" });
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* loginStaff(action) {
  try {
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });
    if (parseInt(codeNumber) == 200) {
      yield put({ ...action, type: "LOGIN_STAFF_SUCCESS" });
      yield call(saveAuthToken, responses.data?.token);

      action.isPincodeInvoice
        ? yield put({
            type: "GET_LIST_INVOICE_BY_MERCHANT",
            method: "GET",
            api: `${Configs.API_URL}checkout?page=1&method=&status=&timeStart=&timeEnd=&key=&quickFilter=`,
            token: true,
            isShowLoading: true,
            currentPage: 1,
            isLoadMore: true,
          })
        : yield put({
            type: "UPDATE_PROFILE_STAFF_SUCCESS",
            payload: responses.data,
          });

      yield put({
        type: "RESET_STATE_LOGIN_STAFF",
        payload: true,
      });

    } else if (parseInt(codeNumber) === 401) {
      yield put({ type: "LOGIN_STAFF_FAIL" });
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({ type: "LOGIN_STAFF_FAIL" });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
    yield put({ type: "STOP_LOADING_ROOT" });
  } catch (error) {
    yield put({ type: "LOGIN_STAFF_FAIL" });
    yield put({ type: "STOP_LOADING_ROOT" });
    yield put({ ...action, type: error, typeParent: action.type });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* forgotPin(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "RESET_VISIBLE_FORGOT_PIN",
        payload: false,
      });
      yield put({ type: "STOP_LOADING_ROOT" });
      setTimeout(() => {
        alert(`Please check email : ${action.email}`);
      }, 300);
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* updateStaffsPosition(action) {
  try {
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* getListStaffsSalaryTop(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "GET_LIST_STAFFS_SALARY_TOP_SUCCESS",
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "GET_LIST_STAFFS_SALARY_TOP_FAIL",
      });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({
      type: "GET_LIST_STAFFS_SALARY_TOP_FAIL",
    });
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* exportReportStaff(action) {
  try {
    yield put({
      type: "DOWNLOAD_REPORT_STAFF",
    });

    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      const dirs = RNFetchBlob.fs.dirs;
      const fileDownload = yield RNFetchBlob.config({
        title: `${action.fileName}.${action.extention}`,
        fileCache: true,
        appendExt: `${action.extention}`,
        useDownloadManager: true,
        mediaScannable: true,
        notification: true,
        description: "File downloaded by download manager.",
        path: `${dirs.DocumentDir}/${action.fileName}.${action.extention}`,
      }).fetch("GET", responses.data.path, {});

      switch (action.type) {
        case "EXPORT_STAFFS_SALARY":
          yield put({
            type: "DOWNLOAD_REPORT_STAFF_SALARY_SUCCESS",
            payload: fileDownload.path(),
          });
          break;
        case "EXPORT_STAFFS_STATISTICS":
          yield put({
            type: "DOWNLOAD_REPORT_STAFF_STATISTIC_SUCCESS",
            payload: fileDownload.path(),
          });
          break;

        default:
          break;
      }
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

export default function* saga() {
  yield all([
    takeLatest("ADD_STAFF_BY_MERCHANT", addStaffByMerchant),
    takeLatest("GET_STAFF_BY_MERCHANR_ID", getStaffByMerchantId),
    takeLatest("SEARCH_STAFF_BY_NAME", searchStaffByName),
    takeLatest("ARCHICVE_STAFF", archiveStaff),
    takeLatest("RESTORE_STAFF", restoreStaff),
    takeLatest("CREATE_ADMIN", createAdmin),
    takeLatest("EDIT_STAFF_BY_MERCHANT", editStaff),
    takeLatest("LOGIN_STAFF", loginStaff),
    takeLatest("FORGOT_PIN", forgotPin),
    takeLatest("UPDATE_STAFFS_POSITION", updateStaffsPosition),
    takeLatest("GET_LIST_STAFFS_SALARY_TOP", getListStaffsSalaryTop),
    takeLatest("EXPORT_STAFFS_SALARY", exportReportStaff),
    takeLatest("EXPORT_STAFFS_STATISTICS", exportReportStaff),
    takeLatest("GET_STAFF_DETAIL_BY_ID", getStaffDetailByMerchantId),
  ]);
}
