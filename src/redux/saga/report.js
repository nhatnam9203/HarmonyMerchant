import { put, takeLatest, all, join } from "redux-saga/effects";
import NavigationServices from "../../navigators/NavigatorServices";

import { requestAPI, uploadFromData } from "../../utils";
import apiConfigs from "../../configs/api";

import { Alert } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

import actions from "@actions";
const { ACTION_TYPES } = actions.report;

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

function* getReportOverallMarketingEfficiency(action) {
  try {
    action.isShowLoading ? yield put({ type: "LOADING_ROOT" }) : "";
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: "GET_REPORT_OVERALL_MARKETING_EFFICIENCY_SUCCESS",
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: "GET_REPORT_OVERALL_MARKETING_EFFICIENCY_FAIL",
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

function* exportReport(action) {
  try {
    yield put({
      type: "DOWNLOAD_REPORT_OPM_EXPORT",
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
      }).fetch("GET", responses.data, {});

      switch (action.type) {
        case ACTION_TYPES.OPM_Export:
          yield put({
            type: ACTION_TYPES.OPM_ExportSuccess,
            payload: fileDownload.path(),
          });
          break;
        case ACTION_TYPES.OPM_StatisticExport:
          yield put({
            type: ACTION_TYPES.OPM_StatisticExportSuccess,
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
      ACTION_TYPES.GetOverallPaymentMethod,
      getReportOverallPaymentMethod
    ),
    takeLatest(ACTION_TYPES.OPM_Export, exportReport),
    takeLatest(ACTION_TYPES.OPM_StatisticExport, exportReport),
    takeLatest(ACTION_TYPES.OME_GetList, getReportOverallMarketingEfficiency),
  ]);
}
