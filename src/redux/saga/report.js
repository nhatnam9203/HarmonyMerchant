import { put, takeLatest, all } from "redux-saga/effects";
import RNFetchBlob from "rn-fetch-blob";

import { requestAPI } from "../../utils";

import actions from "../actions";

const { ACTION_TYPES } = actions.report;

function* getReportOverallPaymentMethod(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
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
        message: responses?.message,
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
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
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
        message: responses?.message,
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
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
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
        message: responses?.message,
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
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
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
        message: responses?.message,
      });
    }
  } catch (error) {
    yield put({ type: error });
  } finally {
    yield put({ type: "STOP_LOADING_ROOT" });
  }
}

function* getServiceSalesByCategory(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: ACTION_TYPES.ServiceCategory_GetListSuccess,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: ACTION_TYPES.ServiceCategory_GetListFail,
      });
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

function* getServiceSalesByService(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: ACTION_TYPES.Service_GetListSuccess,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: ACTION_TYPES.Service_GetListFail,
      });
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

function* getProductSalesByCategory(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: ACTION_TYPES.ProductCategory_GetListSuccess,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: ACTION_TYPES.ProductCategory_GetListFail,
      });
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

function* getProductSalesByProduct(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: ACTION_TYPES.Product_GetListSuccess,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      yield put({
        type: ACTION_TYPES.Product_GetListFail,
      });
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

function* getReportStaffServiceDuration(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: ACTION_TYPES.Staff_Get_Service_Duration_Success,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      // yield put({
      //   type: ACTION_TYPES.Product_GetListFail,
      // });
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

function* getReportStaffServiceDurationDetail(action) {
  try {
    if (action.isShowLoading) {
      yield put({ type: "LOADING_ROOT" });
    }
    const responses = yield requestAPI(action, {}, true);
    const { codeNumber } = responses;
    yield put({ type: "STOP_LOADING_ROOT" });

    if (parseInt(codeNumber) == 200) {
      yield put({
        type: ACTION_TYPES.Staff_Get_Service_Duration_Detail_Success,
        payload: responses.data,
      });
    } else if (parseInt(codeNumber) === 401) {
      yield put({
        type: "UNAUTHORIZED",
      });
    } else {
      // yield put({
      //   type: ACTION_TYPES.Product_GetListFail,
      // });
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

/**export */

function* exportReport(action) {
  try {
    yield put({
      type: "DOWNLOAD_REPORT_EXPORT",
    });

    const responses = yield requestAPI(action, {}, true);

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

        case ACTION_TYPES.ServiceCategory_Export:
          yield put({
            type: ACTION_TYPES.ServiceCategory_ExportSuccess,
            payload: fileDownload.path(),
          });
          break;
        case ACTION_TYPES.ServiceCategory_ExportStatistic:
          yield put({
            type: ACTION_TYPES.ServiceCategory_ExportStatisticSuccess,
            payload: fileDownload.path(),
          });
          break;
        case ACTION_TYPES.Service_Export:
          yield put({
            type: ACTION_TYPES.Service_ExportSuccess,
            payload: fileDownload.path(),
          });
        case ACTION_TYPES.Service_ExportStatistic:
          yield put({
            type: ACTION_TYPES.Service_ExportStatisticSuccess,
            payload: fileDownload.path(),
          });
          break;
        case ACTION_TYPES.ProductCategory_Export:
          yield put({
            type: ACTION_TYPES.ProductCategory_ExportSuccess,
            payload: fileDownload.path(),
          });
          break;
        case ACTION_TYPES.ProductCategory_ExportStatistic:
          yield put({
            type: ACTION_TYPES.ProductCategory_ExportStatisticSuccess,
            payload: fileDownload.path(),
          });
          break;
        case ACTION_TYPES.Product_Export:
          yield put({
            type: ACTION_TYPES.Product_ExportSuccess,
            payload: fileDownload.path(),
          });
          break;
        case ACTION_TYPES.Product_ExportStatistic:
          yield put({
            type: ACTION_TYPES.Product_ExportStatisticSuccess,
            payload: fileDownload.path(),
          });
          break;

        case ACTION_TYPES.Staff_Export_Service_Duration:
          yield put({
            type: ACTION_TYPES.Staff_Export_Service_Duration_Success,
            payload: fileDownload.path(),
          });
          break;

        case ACTION_TYPES.Staff_Export_Service_Duration_Detail:
          yield put({
            type: ACTION_TYPES.Staff_Export_Service_Duration_Detail_Success,
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

    takeLatest(ACTION_TYPES.ServiceCategory_GetList, getServiceSalesByCategory),
    takeLatest(ACTION_TYPES.Service_GetList, getServiceSalesByService),
    takeLatest(ACTION_TYPES.ProductCategory_GetList, getProductSalesByCategory),
    takeLatest(ACTION_TYPES.Product_GetList, getProductSalesByProduct),

    takeLatest(ACTION_TYPES.ServiceCategory_Export, exportReport),
    takeLatest(ACTION_TYPES.ServiceCategory_ExportStatistic, exportReport),
    takeLatest(ACTION_TYPES.Service_Export, exportReport),
    takeLatest(ACTION_TYPES.Service_ExportStatistic, exportReport),
    takeLatest(ACTION_TYPES.ProductCategory_Export, exportReport),
    takeLatest(ACTION_TYPES.ProductCategory_ExportStatistic, exportReport),
    takeLatest(ACTION_TYPES.Product_Export, exportReport),
    takeLatest(ACTION_TYPES.Product_ExportStatistic, exportReport),

    takeLatest(
      ACTION_TYPES.Staff_Get_Service_Duration,
      getReportStaffServiceDuration
    ),
    takeLatest(
      ACTION_TYPES.Staff_Get_Service_Duration_Detail,
      getReportStaffServiceDurationDetail
    ),

    takeLatest(ACTION_TYPES.Staff_Export_Service_Duration, exportReport),
    takeLatest(ACTION_TYPES.Staff_Export_Service_Duration_Detail, exportReport),
  ]);
}
