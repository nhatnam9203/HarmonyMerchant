import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import { requestAPI, uploadFromData } from "../../utils";
import apiConfigs from "../../configs/api";
import actions from "@actions";

function* getReportOverallPaymentMethod(action) {
  try {
    action.isShowLoading ? yield put({ type: "LOADING_ROOT" }) : "";
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "GET_REPORT_OVERALL_PAYMENT_METHOD_SUCCESS",
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "GET_REPORT_OVERALL_PAYMENT_METHOD_FAIL",
      });
      yield put({
        type: "SHOW_ERROR_MESSAGE",
        message: responses.message,
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
    takeLatest(
      actions.report.TC.GetOverallPaymentMethod,
      getReportOverallPaymentMethod
    ),
    // takeLatest("UPLOAD_BANNER", uploadBanner),
  ]);
}
