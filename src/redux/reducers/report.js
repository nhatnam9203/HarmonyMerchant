import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer } from "redux-persist";
import actions from "../actions";

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
  exportFilePath: null,

  serviceSaleByCategoryList: [],
  serviceSaleByCategoryExportPath: null,
  serviceSaleByCategoryDetailExportPath: null,

  serviceSaleByServiceList: [],
  serviceSaleByServiceExportPath: null,
  serviceSaleByServiceDetailExportPath: null,

  productSaleByCategoryList: [],
  productSaleByCategoryExportPath: null,
  productSaleByCategoryDetailExportPath: null,

  productSaleByProductList: [],
  productSaleByProductExportPath: null,
  productSaleByProductDetailExportPath: null,

  staffServiceDurationList: [],
  staffServiceDurationDetailList: [],
  staffServiceDurationExportPath: null,
  staffServiceDurationDetailExportPath: null,
};

function reportReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.OPM_GetListSuccess:
      return {
        ...state,
        overallPaymentMethodList: action.payload,
        overallPMExportFilePath: null,
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
        statisticExportFilePath: null,

        serviceSaleByCategoryDetailExportPath: null,
        serviceSaleByServiceDetailExportPath: null,
        productSaleByCategoryDetailExportPath: null,
        productSaleByProductDetailExportPath: null,

        staffServiceDurationExportPath: null,
        staffServiceDurationDetailExportPath: null,


      };
    case ACTION_TYPES.OME_GetListSuccess:
      return {
        ...state,
        marketingEfficiencyList: action.payload,
        meExportFilePath: null,
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
        exportFilePath: action.payload,
        isDownloadReport: false,
      };

    // Service
    case ACTION_TYPES.ServiceCategory_GetListSuccess:
      return {
        ...state,
        serviceSaleByCategoryList: action.payload,
        serviceSaleByCategoryExportPath: null,
      };

    case ACTION_TYPES.ServiceCategory_ExportSuccess:
      return {
        ...state,
        serviceSaleByCategoryExportPath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.ServiceCategory_ExportStatisticSuccess:
      return {
        ...state,
        serviceSaleByCategoryDetailExportPath: action.payload,
        isDownloadReport: false,
      };

    case ACTION_TYPES.Service_GetListSuccess:
      return {
        ...state,
        serviceSaleByServiceList: action.payload,
        serviceSaleByServiceExportPath: null,
      };

    case ACTION_TYPES.Service_ExportSuccess:
      return {
        ...state,
        serviceSaleByServiceExportPath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.Service_ExportStatisticSuccess:
      return {
        ...state,
        serviceSaleByServiceDetailExportPath: action.payload,
        isDownloadReport: false,
      };

    // Product
    case ACTION_TYPES.ProductCategory_GetListSuccess:
      return {
        ...state,
        productSaleByCategoryList: action.payload,
        productSaleByCategoryExportPath: null,
      };

    case ACTION_TYPES.ProductCategory_ExportSuccess:
      return {
        ...state,
        productSaleByCategoryExportPath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.ProductCategory_ExportStatisticSuccess:
      return {
        ...state,
        productSaleByCategoryDetailExportPath: action.payload,
        isDownloadReport: false,
      };

    case ACTION_TYPES.Product_GetListSuccess:
      return {
        ...state,
        productSaleByProductList: action.payload,
        productSaleByProductExportPath: null,
      };

    case ACTION_TYPES.Product_ExportSuccess:
      return {
        ...state,
        productSaleByProductExportPath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.Product_ExportStatisticSuccess:
      return {
        ...state,
        productSaleByProductDetailExportPath: action.payload,
        isDownloadReport: false,
      };
    // staff service duration
    case ACTION_TYPES.Staff_Get_Service_Duration_Success:
      return {
        ...state,
        staffServiceDurationList: action.payload,
      };
    case ACTION_TYPES.Staff_Get_Service_Duration_Detail_Success:
      return {
        ...state,
        staffServiceDurationDetailList: action.payload,
      };
    case ACTION_TYPES.Staff_Export_Service_Duration_Success:
      return {
        ...state,
        staffServiceDurationExportPath: action.payload,
        isDownloadReport: false,
      };
    case ACTION_TYPES.Staff_Export_Service_Duration_Detail_Success:
      return {
        ...state,
        staffServiceDurationDetailExportPath: action.payload,
        isDownloadReport: false,
      };

    case "LOGOUT_APP":
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

// module.exports = persistReducer({
//   key: "report",
//   storage: AsyncStorage,
//   whitelist: [],
// }, reportReducer);

export default reportReducer;
