import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer } from "redux-persist";
import actions from "@actions";
const { ACTION_TYPES } = actions.report;

const initialState = {
  isDownloadReport: false,

  overallPaymentMethodList: [],
  overallPMExportFilePath: null,
  overallPMStatisticExportFilePath: null,

  marketingEfficiencyList: [],
  meExportFilePath: null,
  meStatisticExportFilePath: null,

  giftCardReportList: [],
  giftCardExportFilePath: null,
  giftCardStatisticExportFilePath: null,

  customerReportList: [],
  customerExportFilePath: null,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.OPM_GetListSuccess:
      return {
        ...state,
        overallPaymentMethodList: action.payload,
      };
    case "DOWNLOAD_REPORT_EXPORT":
      return {
        ...state,
        isDownloadReport: true,
      };
    case ACTION_TYPES.OPM_ExportSuccess:
      return {
        ...state,
        overallPMExportFilePath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.OPM_StatisticExportSuccess:
      return {
        ...state,
        overallPMStatisticExportFilePath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.OME_ExportSuccess:
      return {
        ...state,
        meExportFilePath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.OME_StatisticExportSuccess:
      return {
        ...state,
        meStatisticExportFilePath: action.payload,
        isDownloadReport: false,
      };
    case "RESET_DOWNLOAD_FILE_REPORT":
      return {
        ...state,
        isDownloadReport: false,
        overallPMStatisticExportFilePath: null,
        meStatisticExportFilePath: null,
        giftCardStatisticExportFilePath: null,
        customerStatisticExportFilePath: null,
      };
    case ACTION_TYPES.OME_GetListSuccess:
      return {
        ...state,
        marketingEfficiencyList: action.payload,
      };
    case ACTION_TYPES.GiftCard_GetListSuccess:
      return {
        ...state,
        giftCardReportList: action.payload,
      };
    case ACTION_TYPES.GiftCard_ExportSuccess:
      return {
        ...state,
        giftCardExportFilePath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.GiftCard_ExportStatisticSuccess:
      return {
        ...state,
        giftCardStatisticExportFilePath: action.payload,
        isDownloadReport: false,
      };

    //customer
    case ACTION_TYPES.Customer_GetListSuccess:
      return {
        ...state,
        customerReportList: action.payload,
      };
    case ACTION_TYPES.Customer_ExportSuccess:
      return {
        ...state,
        customerExportFilePath: action.payload,
        isDownloadReport: false,
      };

    default:
      return state;
  }
}

const persistConfig = {
  key: "report",
  storage: AsyncStorage,
  whitelist: [],
};

module.exports = persistReducer(persistConfig, appReducer);
