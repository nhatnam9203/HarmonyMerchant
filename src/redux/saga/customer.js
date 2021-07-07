import { put, takeLatest, all, takeEvery } from "redux-saga/effects";

import apiConfigs from "../../configs/api";
import { requestAPI } from "../../utils";
import actions from "../actions";

function* getListCustomersByMerchant(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "GET_LIST_CUSTOMER_BY_MERCHANT_SUCCESS",
        payload: responses?.data || [],
        totalPages: responses?.pages || 0,
        currentPage: action.currentPage,
        totalCustomerMerchant: responses?.count || 0
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({ type: "GET_LIST_CUSTOMER_BY_MERCHANT_FAIL" });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: "GET_LIST_CUSTOMER_BY_MERCHANT_FAIL" });
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* searchCustomer(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "SEARCH_CUSTOMER_SUCCESS",
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
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* addCustomer(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      if (action?.isGetCustomerInfoIncheckoutTab) {
        yield put({
          type: "GET_CUSTOMER_INFO_BUY_APPOINTMENT_SUCCESS",
          payload: responses?.data || {},
        });
        yield put({
          type: "CHANGE_CUSTOMER_IN_APPOINTMENT",
        });
        yield put(actions.appointment.switchVisibleAddEditCustomerPopup(false));
      } else {
        yield put({
          type: "ADD_CUSTOMER_SUCCESS",
        });
        yield put({
          type: "GET_LIST_CUSTOMER_BY_MERCHANT",
          method: "GET",
          api: `${apiConfigs.BASE_API}customer/search?key=&page=1`,
          token: true,
          isShowLoading: true,
          currentPage: 1,
          isShowLoadMore: false,
        });
      }
      yield put({
        type: "COUNT_CUSTOMER",
        method: "GET",
        api: `${apiConfigs.BASE_API}customer/count`,
        token: true,
      })
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
      yield put({
        type: "ADD_CUSTOMER_FAIL",
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* editCustomer(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      if (action?.isGetCustomerInfoInCheckoutTab) {
        yield put({
          type: "GET_CUSTOMER_INFO_BY_ID",
          method: "GET",
          api: `${apiConfigs.BASE_API}customer/${action?.customerId}`,
          token: true,
          isGetCustomerInfoInCheckoutTab:
            action?.isGetCustomerInfoInCheckoutTab,
        });
      } else {
        yield put({
          type: "EDIT_CUSTOMER_SUCCESS",
        });
        yield put({
          type: "GET_LIST_CUSTOMER_BY_MERCHANT",
          method: "GET",
          api: `${apiConfigs.BASE_API}customer/search?key=&page=1`,
          token: true,
          isShowLoading: true,
          currentPage: 1,
          isShowLoadMore: false,
        });
        yield put({
          type: "GET_CUSTOMER_INFO_BY_ID",
          method: "GET",
          api: `${apiConfigs.BASE_API}customer/${action?.customerId}`,
          token: true,
        });
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
      yield put({
        type: "EDIT_CUSTOMER_FAIL",
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* deleteCustomer(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      if (action?.isGetCustomerInfoInCheckoutTab) {
        yield put({
          type: "GET_CUSTOMER_INFO_BY_ID",
          method: "GET",
          api: `${apiConfigs.BASE_API}customer/${action?.customerId}`,
          token: true,
          isGetCustomerInfoInCheckoutTab:
            action?.isGetCustomerInfoInCheckoutTab,
        });
      } else {
        yield put({
          type: "DELETE_CUSTOMER_SUCCESS",
        });
        yield put({
          type: "GET_LIST_CUSTOMER_BY_MERCHANT",
          method: "GET",
          api: `${apiConfigs.BASE_API}customer/search?key=&page=1`,
          token: true,
          isShowLoading: true,
          currentPage: 1,
          isShowLoadMore: false,
        });
      }
      yield put({
        type: "COUNT_CUSTOMER",
        method: "GET",
        api: `${apiConfigs.BASE_API}customer/count`,
        token: true,
      })
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses?.message,
      });
      yield put({
        type: "DELETE_CUSTOMER_FAIL",
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* getCustomerInfoByPhone(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
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

function* sendGoogleReviewLink(action) {
  try {
    const responses = yield requestAPI(action);
  } catch (error) {
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* getCustomerInfoById(action) {
  try {
    yield put({ type: "LOADING_ROOT" });
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      if (action?.isGetCustomerInfoInCheckoutTab) {
        yield put({
          type: "GET_CUSTOMER_INFO_BUY_APPOINTMENT_SUCCESS",
          payload: responses?.data || {},
        });
        yield put({
          type: "CHANGE_CUSTOMER_IN_APPOINTMENT",
        });
        yield put(actions.appointment.switchVisibleAddEditCustomerPopup(false));
      } else if (action?.isVisibleCustomerInfoPopup) {
        yield put({
          type: "GET_CUSTOMER_IN_CHECKOUT_TAB_SUCCESS",
          payload: responses?.data || {},
        });
        yield put(actions.appointment.switchVisibleAddEditCustomerPopup(true));
      } else {
        yield put({
          type: "GET_CUSTOMER_INFO_BY_ID__SUCCESS",
          payload: responses?.data,
        });
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

function* getPastAppointments(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action);
    yield put({ type: "STOP_LOADING_ROOT" });
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "GET_PAST_APPOINTMENT_SUCCESS",
        payload: responses?.data || [],
        totalPastAppointmentPages: responses?.pages || 0,
        currentPastAppointmentPage: action.currentPage,
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
      yield put({
        type: "GET_PAST_APPOINTMENT_FAIL",
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* countCustomer(action) {
  try {
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "SET_COUNT_CUSTOMER",
        payload: responses?.data || 0,
      })
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
  }
}


export default function* saga() {
  yield all([
    takeLatest("GET_LIST_CUSTOMER_BY_MERCHANT", getListCustomersByMerchant),
    takeLatest("SEARCH_CUSTOMER", searchCustomer),
    takeLatest("ADD_CUSTOMER", addCustomer),
    takeLatest("EDIT_CUSTOMER", editCustomer),
    takeLatest("DELETE_CUSTOMER", deleteCustomer),
    takeLatest("GET_CUSTOMER_INFO_BY_PHONE", getCustomerInfoByPhone),
    takeEvery("SEND_GOOGLE_REVIEW_LIINK", sendGoogleReviewLink),
    takeLatest("GET_CUSTOMER_INFO_BY_ID", getCustomerInfoById),
    takeLatest("GET_PAST_APPOINTMENT", getPastAppointments),
    takeLatest("COUNT_CUSTOMER", countCustomer),
  ]);
}
