import AsyncStorage from "@react-native-community/async-storage";
import DeviceInfo from "react-native-device-info";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import Configs from "@configs";
import NavigationServices from "../../navigators/NavigatorServices";
import { requestAPI, menuTabs } from "../../utils";
import { saveAuthToken, saveAuthTokenReport } from "@shared/storages/authToken";

const getAsyncStoreToken = async () => {
  let token = null;
  try {
    token = await AsyncStorage.getItem("fcmToken");
  } catch (error) {}

  return token;
};

const getFcmToken = async () => {
  const token = await getAsyncStoreToken();
  if (token) {
    return token;
  }

  return new Promise(async (resolve, reject) => {
    const waiting = setTimeout(() => {
      reject(null);
    }, 10000);

    const token = await getAsyncStoreToken();
    resolve(token);

    clearTimeout(waiting);
  });
};
const getDeviceId = async () => DeviceInfo.getUniqueId() || "simulator";

function* login(action) {
  let responses = {};
  try {
    yield put({
      type: "LOGIN_APP_FAIL",
      payload: null,
    });
    yield put({ type: "LOADING_ROOT" });

    const fcmToken = yield call(getFcmToken);
    const deviceUniqueId = yield call(getDeviceId);

    let body = action.body || {};
    body = Object.assign({}, body, {
      firebaseToken: fcmToken,
      deviceId: deviceUniqueId,
    });
    action.body = body;

    responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "SAVE_PROFILE_LOCAL",
        payload: {
          profile: responses?.data?.merchant,
          token: responses?.data?.token,
        },
      });
      yield put({
        type: "LOGIN_APP_SUCCESS",
        payload: action?.body?.email || "",
        isRememberMID: action.isRememberMID,
      });

      yield call(saveAuthToken, responses?.data?.token);

      yield put({ type: "STOP_LOADING_ROOT" });
      // NavigationServices.navigate("Splash");
      NavigationServices.replace("merchant.splash");
    } else {
      yield put({
        type: "LOGIN_APP_FAIL",
        payload: responses,
      });
    }
  } catch (error) {
    yield put({
      type: "LOGIN_APP_FAIL",
      payload: error,
    });
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* loginReportServer(action) {
  let responses = {};
  try {
    yield put({
      type: "LOGIN_REPORT_SERVER_FAIL",
      payload: null,
    });
    yield put({ type: "LOADING_ROOT" });

    // const fcmToken = yield call(getFcmToken);
    const deviceUniqueId = yield call(getDeviceId);

    let body = action.body || {};
    body = Object.assign({}, body, {
      // firebaseToken: fcmToken,
      deviceId: deviceUniqueId,
    });
    action.body = body;

    responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "SAVE_PROFILE_REPORT_SERVER",
        payload: {
          profile: responses?.data?.merchant,
          token: responses?.data?.token,
        },
      });
      yield put({
        type: "LOGIN_REPORT_SERVER_SUCCESS",
        payload: action?.body?.email || "",
      });

      yield call(saveAuthTokenReport, responses?.data?.token);

      yield put({ type: "STOP_LOADING_ROOT" });
    } else {
      yield put({
        type: "LOGIN_REPORT_SERVER_FAIL",
        payload: responses,
      });
    }
  } catch (error) {
    yield put({
      type: "LOGIN_REPORT_SERVER_FAIL",
      payload: error,
    });
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* forgotPassword(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      // NavigationServices.navigate("SignIn");
      NavigationServices.replace("AuthNavigator");

      setTimeout(() => {
        alert(`Please check your email`);
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

function* checkStaffPermission(action) {
  try {
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "CHECK_STAFF_PERMISSION_SUCCESS",
      });
      if (action.tabName === menuTabs.MENU_INVOICE) {
        yield put({
          type: "TOGGLE_INVOICE_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_LIST_INVOICE_BY_MERCHANT",
          method: "GET",
          api: `checkout?page=1&method=&status=&timeStart=&timeEnd=&key=&quickFilter=`,
          token: true,
          isShowLoading: true,
          currentPage: 1,
          isLoadMore: true,
        });
        yield put({
          type: "UPDATE_PROFILE_LOGIN_INVOICE",
          payload: responses?.data || {},
        });
      } else if (action.tabName === menuTabs.MENU_SETTLEMENT) {
        yield put({
          type: "TOGGLE_SETTLEMENT_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "HANDLE_INTERNAL_FIRST_SETTLEMENT_STATE",
          payload: true,
        });
      } else if (action.tabName === menuTabs.MENU_CUSTOMER) {
        yield put({
          type: "TOGGLE_CUSTOMER_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_LIST_CUSTOMER_BY_MERCHANT",
          method: "GET",
          api: `customer/search?key=&page=1`,
          token: true,
          isShowLoading: true,
          currentPage: 1,
        });
      } else if (action.tabName === menuTabs.MENU_INVENTORY) {
        yield put({
          type: "TOGGLE_PRODUCT_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_PRODUCTS_BY_MERCHANR_ID",
          method: "GET",
          token: true,
          api: `product/search?name=&category=`,
          isShowLoading: true,
        });
      } else if (action.tabName === menuTabs.MENU_REPORT) {
        yield put({
          type: "TOGGLE_REPORT_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "TOGGLE_REPORT_TAB_PERMISSION_SUCCESS",
        });
      } else if (action.tabName === menuTabs.MENU_SETTING) {
        const state = yield select();
        yield put({
          type: "TOGGLE_SETTING_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_MERCHANT_BY_ID",
          method: "GET",
          token: true,
          api: `merchant/${state?.dataLocal?.profile?.merchantId}`,
          isRefresh: false,
        });
      } else if (action.tabName === menuTabs.MARKETING) {
        yield put({
          type: "TOGGLE_MAKETING_TAB_PERMISSION",
          payload: false,
          isGoToTabMarketing: true,
        });
      } else if (action.tabName === menuTabs.CHECKOUT_DISCOUNT) {
        const appointmentId = action?.appointmentId || 0;
        const type = "SWITCH_POPUP_CHECK_DISCOUNT_PERMISSION";
        yield put({
          type,
          payload: false,
        });
        yield put({
          type: "GET_PROMOTION_BY_APPOINTMENT",
          method: "GET",
          token: true,
          api: `appointment/promotion/${appointmentId}`,
          appointmentId,
          isBlock: action?.isBlock,
        });
      } else if (action.tabName === menuTabs.MENU_GIFTCARD) {
        yield put({
          type: "SWITCH_GIFT_CARD_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_GIFT_CARDS_ACTIVE_LIST",
          method: "GET",
          token: true,
          api: `giftcard/getByMerchant?keySearch=&page=1`,
          currentPage: 1,
          isShowLoading: true,
          isShowLoadMore: false,
          isRefreshing: false,
        });
      } else if (action.tabName === menuTabs.MENU_STAFF_LOGTIME) {
        yield put({
          type: "TOGGLE_STAFF_LOGTIME_TAB_PERMISSION",
          payload: false,
        });
      }
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "CHECK_STAFF_PERMISSION_FAIL",
        message: responses?.message,
      });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({
      type: "CHECK_STAFF_PERMISSION_FAIL",
      message: responses?.message,
    });
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* expiredToken(action) {
  // NavigationServices.navigate("SignIn"); // Of PHI
  NavigationServices.replace("AuthNavigator");
  yield call(saveAuthToken, null);
  yield put({ type: "LOGOUT_APP" });
}

function* requestLogout(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const deviceUniqueId = yield call(getDeviceId);
    let body = action.body || {};
    body = Object.assign({}, body, {
      firebaseToken: "",
      deviceId: deviceUniqueId,
    });
    action.body = body;

    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });

    // NavigationServices.navigate('SignIn');

    NavigationServices.replace("AuthNavigator");
    yield call(saveAuthToken, null);

    yield put({ type: "LOGOUT_APP" });
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* activeFirebase(action) {
  try {
    const deviceUniqueId = yield call(getDeviceId);
    const fcmToken = action.firebaseToken;
    let body = action.body || {};
    body = Object.assign({}, body, {
      firebaseToken: fcmToken,
      deviceId: deviceUniqueId,
    });
    action.body = body;
    const responses = yield requestAPI(action);
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

export default function* saga() {
  yield all([
    takeLatest("LOGIN_APP", login),
    takeLatest("UNAUTHORIZED", expiredToken),
    takeLatest("FORGOT_PASSWORD", forgotPassword),
    takeLatest("CHECK_STAFF_PERMISSION", checkStaffPermission),
    takeLatest("REQUEST_LOGOUT_APP", requestLogout),
    takeLatest("ACTIVE_FIREBASE", activeFirebase),
    takeLatest("LOGIN_REPORT_SERVER", loginReportServer),
  ]);
}
