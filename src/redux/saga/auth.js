import AsyncStorage from "@react-native-community/async-storage";
import DeviceInfo from "react-native-device-info";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import apiConfigs from "../../configs/api";
import NavigationServices from "../../navigators/NavigatorServices";
import { requestAPI } from "../../utils";

const getAsyncStoreToken = async () => {
  let token = null;
  try {
    token = await AsyncStorage.getItem("fcmToken");
  } catch (error) {
  }

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
      yield put({ type: "STOP_LOADING_ROOT" });
      NavigationServices.navigate("Splash");
    } else {
      yield put({
        type: "LOGIN_APP_FAIL",
        payload: responses,
      });
    }
  } catch (error) {
    yield put({
      type: "LOGIN_APP_FAIL",
      payload: responses,
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
      NavigationServices.navigate("SignIn");
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
      if (action.tabName === "Invoice") {
        yield put({
          type: "TOGGLE_INVOICE_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_LIST_INVOICE_BY_MERCHANT",
          method: "GET",
          api: `${apiConfigs.BASE_API}checkout?page=1&method=&status=&timeStart=&timeEnd=&key=&quickFilter=`,
          token: true,
          isShowLoading: true,
          currentPage: 1,
          isLoadMore: true,
        });
        yield put({
          type: "UPDATE_PROFILE_LOGIN_INVOICE",
          payload: responses?.data || {},
        });
      } else if (action.tabName === "Settlement") {
        yield put({
          type: "TOGGLE_SETTLEMENT_TAB_PERMISSION",
          payload: false,
        });

        // yield put({
        //   type: "GET_SETTLEMENT_WAITING",
        //   method: "GET",
        //   api: `${apiConfigs.BASE_API}settlement/waiting`,
        //   token: true,
        //   isShowLoading: true,
        // });
        // yield put({
        //   type: "GET_LIST_STAFFS_SALES",
        //   method: "GET",
        //   token: true,
        //   api: `${apiConfigs.BASE_API}appointment/staffSales`,
        // });
        // yield put({
        //   type: "GET_LIST_GIFT_CARD_SALES",
        //   method: "GET",
        //   token: true,
        //   api: `${apiConfigs.BASE_API}settlement/waiting/giftCardSales`,
        // });
      } else if (action.tabName === "Customer") {
        yield put({
          type: "TOGGLE_CUSTOMER_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_LIST_CUSTOMER_BY_MERCHANT",
          method: "GET",
          api: `${apiConfigs.BASE_API}customer/search?key=&page=1`,
          token: true,
          isShowLoading: true,
          currentPage: 1
        });
      } else if (action.tabName === "Inventory") {
        yield put({
          type: "TOGGLE_PRODUCT_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_PRODUCTS_BY_MERCHANR_ID",
          method: "GET",
          token: true,
          api: `${apiConfigs.BASE_API}product/search?name=&category=`,
          isShowLoading: true,
        });
      } else if (action.tabName === "Reports") {
        yield put({
          type: "TOGGLE_REPORT_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "TOGGLE_REPORT_TAB_PERMISSION_SUCCESS",
        });
      } else if (action.tabName === "Settings") {
        const state = yield select();
        yield put({
          type: "TOGGLE_SETTING_TAB_PERMISSION",
          payload: false,
        });
        yield put({
          type: "GET_MERCHANT_BY_ID",
          method: "GET",
          token: true,
          api: `${apiConfigs.BASE_API}merchant/${state?.dataLocal?.profile?.merchantId}`,
          isRefresh: false,
        });
      } else if (action.tabName === "Marketing") {
        yield put({
          type: "TOGGLE_MAKETING_TAB_PERMISSION",
          payload: false,
          isGoToTabMarketing: true,
        });
      } else if (action.tabName === "CheckDiscountPermission" || action.tabName === "CheckDiscountPermissionInHome") {
        const appointmentId = action?.appointmentId || 0;
        const type = action?.tabName === "CheckDiscountPermission" ? "SWITCH_POPUP_CHECK_DISCOUNT_PERMISSION" : "SWITCH_POPUP_CHECK_DISCOUNT_PERMISSION_IN_HOME";
        yield put({
          type,
          payload: false
        });
        yield put({
          type: 'GET_PROMOTION_BY_APPOINTMENT',
          method: 'GET',
          token: true,
          api: `${apiConfigs.BASE_API}appointment/promotion/${appointmentId}`,
          appointmentId,
          isBlock: action?.isBlock
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
  NavigationServices.navigate("SignIn");
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

    NavigationServices.navigate("SignIn");
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
  ]);
}
