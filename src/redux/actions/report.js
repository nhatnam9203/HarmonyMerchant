import apiConfigs from "../../configs/api";

/**
 * OPM: Overall Payment Method
 */
export const ACTION_TYPES = {
  GetOverallPaymentMethod: "GET_REPORT_OVERALL_PAYMENT_METHOD",
  OPM_Filters: "REPORT_OVERALL_PAYMENT_METHOD_FILTERS",
  OPM_FilterId: "REPORT_OVERALL_PAYMENT_METHOD_FILTER_ID",
  OPM_Export: "EXPORT_OVERALL_PAYMENT_METHOD",
  OPM_StatisticExport: "EXPORT_OVERALL_PAYMENT_METHOD_STATISTICS",
  OPM_ExportSuccess: "EXPORT_OVERALL_PAYMENT_METHOD_SUCCESS",
  OPM_StatisticExportSuccess:
    "EXPORT_OVERALL_PAYMENT_METHOD_STATISTICS_SUCCESS",

  OME_GetList: "GET_REPORT_OVERALL_MARKETING_EFFICIENCY",
  OME_Export: "EXPORT_OVERALL_MARKETING_EFFICIENCY",
  OME_StatisticExport: "EXPORT_OVERALL_MARKETING_EFFICIENCY_STATISTIC",
  OME_ExportSuccess: "EXPORT_OVERALL_MARKETING_EFFICIENCY_SUCCESS",
  OME_StatisticExportSuccess:
    "EXPORT_OVERALL_MARKETING_EFFICIENCY_STATISTIC_SUCCESS",

  GiftCard_GetList: "GET_GIFT_CARD_REPORT_SALES",
  GiftCard_GetListFail: "GET_GIFT_CARD_REPORT_SALES_FAIL",
  GiftCard_GetListSuccess: "GET_GIFT_CARD_REPORT_SALES_SUCCESS",
  GiftCard_Export: "EXPORT_GIFT_CARD_REPORT_SALES",
  GiftCard_ExportStatistic: "EXPORT_GIFT_CARD_REPORT_SALES_STATISTIC",
  GiftCard_ExportSuccess: "EXPORT_GIFT_CARD_REPORT_SALES_SUCCESS",
  GiftCard_ExportStatisticSuccess:
    "EXPORT_GIFT_CARD_REPORT_SALES_STATISTIC_SUCCESS",

  Customer_GetList: "GET_CUSTOMER_REPORT_SALES",
  Customer_GetListFail: "GET_CUSTOMER_REPORT_SALES_FAIL",
  Customer_GetListSuccess: "GET_CUSTOMER_REPORT_SALES_SUCCESS",
  Customer_Export: "EXPORT_CUSTOMER_REPORT_SALES",
  Customer_ExportStatistic: "EXPORT_CUSTOMER_REPORT_SALES_STATISTIC",
  Customer_ExportSuccess: "EXPORT_CUSTOMER_REPORT_SALES_SUCCESS",
  Customer_ExportStatisticSuccess:
    "EXPORT_CUSTOMER_REPORT_SALES_STATISTIC_SUCCESS",
};

/** Get List */
export function getOverallPaymentMethod(
  isShowLoading = true,
  params = "quickFilter=thisWeek"
) {
  return {
    type: ACTION_TYPES.GetOverallPaymentMethod,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/paymentMethod?${params}`,
    isShowLoading,
  };
}

export function getOverallMarketingEfficiency(
  isShowLoading = true,
  params = "quickFilter=thisWeek"
) {
  return {
    type: ACTION_TYPES.OME_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/marketingEfficiency?${params}`,
    isShowLoading,
  };
}

export function getGiftCardReportSales(
  isShowLoading = true,
  params = "quickFilter=thisWeek"
) {
  return {
    type: ACTION_TYPES.GiftCard_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}giftCard/reportSales?${params}`,
    isShowLoading,
  };
}

export function getOPMFilters(filters) {
  return {
    type: ACTION_TYPES.OPM_Filters,
    payload: filters,
  };
}

export function filterOPM(method) {
  return {
    type: ACTION_TYPES.OPM_FilterId,
    payload: method,
  };
}

/**Export  */
export function exportPaymentMethod(
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.OPM_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/paymentMethod/export?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportPaymentMethodStatistics(
  method,
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.OPM_StatisticExport,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/paymentMethod/export/${method}?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportMarketingEfficiency(
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.OME_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/marketingEfficiency/export?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportMarketingEfficiencyStatistics(
  promotionId,
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.OME_StatisticExport,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/marketingEfficiency/export/${promotionId}?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportGiftCardReportSales(
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.GiftCard_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}giftCard/reportSales/export?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportGiftCardReportSalesStatistics(
  giftCardGeneralId,
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.GiftCard_ExportStatistic,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}giftCard/reportSales/export/${giftCardGeneralId}?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function resetExportFiles() {
  return {
    type: "RESET_DOWNLOAD_FILE_REPORT",
  };
}
