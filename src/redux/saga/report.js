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
        type: ACTION_TYPES.OPM_GetListSuccess,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: ACTION_TYPES.OPM_GetListFail,
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
        type: ACTION_TYPES.OME_GetListSuccess,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: ACTION_TYPES.OME_GetListFail,
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

function* getReportGiftCardSales(action) {
  try {
    action.isShowLoading ? yield put({ type: "LOADING_ROOT" }) : "";
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: ACTION_TYPES.GiftCard_GetListSuccess,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: ACTION_TYPES.GiftCard_GetListFail,
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

function* getReportCustomerSales(action) {
  try {
    action.isShowLoading ? yield put({ type: "LOADING_ROOT" }) : "";
    const responses = yield requestAPI(action);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: ACTION_TYPES.Customer_GetListSuccess,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: ACTION_TYPES.Customer_GetListFail,
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

/**export */

function* exportReport(action) {
  try {
    yield put({
      type: "DOWNLOAD_REPORT_EXPORT",
    });

    const responses = yield requestAPI(action);

    const { codeNumber } = responses;
    console.log(`${JSON.stringify(responses)}`);
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

        case ACTION_TYPES.OME_Export:
          yield put({
            type: ACTION_TYPES.OME_ExportSuccess,
            payload: fileDownload.path(),
          });
          break;

        case ACTION_TYPES.OME_StatisticExport:
          yield put({
            type: ACTION_TYPES.OME_StatisticExportSuccess,
            payload: fileDownload.path(),
          });
          break;

        case ACTION_TYPES.GiftCard_Export:
          yield put({
            type: ACTION_TYPES.GiftCard_ExportSuccess,
            payload: fileDownload.path(),
          });
          break;

        case ACTION_TYPES.GiftCard_ExportStatistic:
          yield put({
            type: ACTION_TYPES.GiftCard_ExportStatisticSuccess,
            payload: fileDownload.path(),
          });
          break;

        case ACTION_TYPES.Customer_Export:
          yield put({
            type: ACTION_TYPES.Customer_ExportSuccess,
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
    takeLatest(ACTION_TYPES.OPM_GetList, getReportOverallPaymentMethod),
    takeLatest(ACTION_TYPES.OPM_Export, exportReport),
    takeLatest(ACTION_TYPES.OPM_StatisticExport, exportReport),
    takeLatest(ACTION_TYPES.OME_GetList, getReportOverallMarketingEfficiency),
    takeLatest(ACTION_TYPES.OME_Export, exportReport),
    takeLatest(ACTION_TYPES.OME_StatisticExport, exportReport),
    takeLatest(ACTION_TYPES.GiftCard_GetList, getReportGiftCardSales),
    takeLatest(ACTION_TYPES.GiftCard_Export, exportReport),
    takeLatest(ACTION_TYPES.GiftCard_ExportStatistic, exportReport),
    takeLatest(ACTION_TYPES.Customer_GetList, getReportCustomerSales),
    takeLatest(ACTION_TYPES.Customer_Export, exportReport),
  ]);
}
