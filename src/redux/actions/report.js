import apiConfigs from "../../configs/api";

/**
 * OPM: Overall Payment Method
 */
export const ACTION_TYPES = {
  OPM_GetList: "GET_REPORT_OVERALL_PAYMENT_METHOD",
  OPM_GetListFail: "GET_REPORT_OVERALL_PAYMENT_METHOD_FAIL",
  OPM_GetListSuccess: "GET_REPORT_OVERALL_PAYMENT_METHOD_SUCCESS",
  OPM_Export: "EXPORT_OVERALL_PAYMENT_METHOD",
  OPM_StatisticExport: "EXPORT_OVERALL_PAYMENT_METHOD_STATISTICS",
  OPM_ExportSuccess: "EXPORT_OVERALL_PAYMENT_METHOD_SUCCESS",
  OPM_StatisticExportSuccess:
    "EXPORT_OVERALL_PAYMENT_METHOD_STATISTICS_SUCCESS",

  OME_GetList: "GET_REPORT_OVERALL_MARKETING_EFFICIENCY",
  OME_GetListFail: "GET_REPORT_OVERALL_MARKETING_EFFICIENCY_FAIL",
  OME_GetListSuccess: "GET_REPORT_OVERALL_MARKETING_EFFICIENCY_SUCCESS",
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
  Customer_ExportSuccess: "EXPORT_CUSTOMER_REPORT_SALES_SUCCESS",

  ServiceCategory_GetList: "GET_SERVICE_SALE_BY_CATEGORY",
  ServiceCategory_GetListFail: "GET_SERVICE_SALE_BY_CATEGORY_FAIL",
  ServiceCategory_GetListSuccess: "GET_SERVICE_SALE_BY_CATEGORY_SUCCESS",
  ServiceCategory_Export: "EXPORT_SERVICE_SALES_BY_CATEGORY_REPORT",
  ServiceCategory_ExportSuccess:
    "EXPORT_SERVICE_SALES_BY_CATEGORY_REPORT_SUCCESS",
  ServiceCategory_ExportStatistic:
    "EXPORT_SERVICE_SALES_BY_CATEGORY_REPORT_STATISTIC",
  ServiceCategory_ExportStatisticSuccess:
    "EXPORT_SERVICE_SALES_BY_CATEGORY_REPORT_STATISTIC_SUCCESS",

  Service_GetList: "GET_SERVICE_SALE_BY_SERVICE",
  Service_GetListFail: "GET_SERVICE_SALE_BY_SERVICE_FAIL",
  Service_GetListSuccess: "GET_SERVICE_SALE_BY_SERVICE_SUCCESS",
  Service_Export: "EXPORT_SERVICE_SALES_BY_SERVICE_REPORT",
  Service_ExportSuccess: "EXPORT_SERVICE_SALES_BY_SERVICE_REPORT_SUCCESS",
  Service_ExportStatistic: "EXPORT_SERVICE_SALES_BY_SERVICE_REPORT_STATISTIC",
  Service_ExportStatisticSuccess:
    "EXPORT_SERVICE_SALES_BY_SERVICE_REPORT_STATISTIC_SUCCESS",

  ProductCategory_GetList: "GET_PRODUCT_SALE_BY_CATEGORY",
  ProductCategory_GetListFail: "GET_PRODUCT_SALE_BY_CATEGORY_FAIL",
  ProductCategory_GetListSuccess: "GET_PRODUCT_SALE_BY_CATEGORY_SUCCESS",
  ProductCategory_Export: "EXPORT_PRODUCT_SALES_BY_CATEGORY_REPORT",
  ProductCategory_ExportSuccess:
    "EXPORT_PRODUCT_SALES_BY_CATEGORY_REPORT_SUCCESS",
  ProductCategory_ExportStatistic:
    "EXPORT_PRODUCT_SALES_BY_CATEGORY_REPORT_STATISTIC",
  ProductCategory_ExportStatisticSuccess:
    "EXPORT_PRODUCT_SALES_BY_CATEGORY_REPORT_STATISTIC_SUCCESS",

  Product_GetList: "GET_PRODUCT_SALE_BY_PRODUCT",
  Product_GetListFail: "GET_PRODUCT_SALE_BY_PRODUCT_FAIL",
  Product_GetListSuccess: "GET_PRODUCT_SALE_BY_PRODUCT_SUCCESS",
  Product_Export: "EXPORT_PRODUCT_SALES_BY_PRODUCT_REPORT",
  Product_ExportSuccess: "EXPORT_PRODUCT_SALES_BY_PRODUCT_REPORT_SUCCESS",
  Product_ExportStatistic: "EXPORT_PRODUCT_SALES_BY_PRODUCT_REPORT_STATISTIC",
  Product_ExportStatisticSuccess:
    "EXPORT_PRODUCT_SALES_BY_PRODUCT_REPORT_STATISTIC_SUCCESS",
};

/** Get List */
export function getOverallPaymentMethod(
  isShowLoading = true,
  params = "quickFilter=thisWeek",
  method = "all"
) {
  return {
    type: ACTION_TYPES.OPM_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/paymentMethod?${params}&method=${method}`,
    isShowLoading,
  };
}

export function getOverallMarketingEfficiency(
  isShowLoading = true,
  params = "quickFilter=thisWeek",
  promotionId = 0
) {
  return {
    type: ACTION_TYPES.OME_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/marketingEfficiency?${params}&promotionId=${promotionId}`,
    isShowLoading,
  };
}

export function getGiftCardReportSales(
  isShowLoading = true,
  params = "quickFilter=thisWeek",
  giftCardGeneralId = 0
) {
  return {
    type: ACTION_TYPES.GiftCard_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}giftCard/reportSales?${params}&giftCardGeneralId=${giftCardGeneralId}`,
    isShowLoading,
  };
}

export function getServiceByCategoryReportSales(
  isShowLoading = true,
  params = "quickFilter=thisWeek",
  categoryId = "top5"
) {
  return {
    type: ACTION_TYPES.ServiceCategory_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}service/report/saleByCategory?${params}&category=${categoryId}`,
    isShowLoading,
  };
}

export function getServiceByServiceReportSales(
  isShowLoading = true,
  params = "quickFilter=thisWeek",
  serviceId = "top5"
) {
  return {
    type: ACTION_TYPES.Service_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}service/report/saleByService?${params}&service=${serviceId}`,
    isShowLoading,
  };
}

export function getProductByCategoryReportSales(
  isShowLoading = true,
  params = "quickFilter=thisWeek",
  categoryId = "top5"
) {
  return {
    type: ACTION_TYPES.ProductCategory_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}product/report/saleByCategory?${params}&category=${categoryId}`,
    isShowLoading,
  };
}

export function getProductByProductReportSales(
  isShowLoading = true,
  params = "quickFilter=thisWeek",
  productId = "top5"
) {
  return {
    type: ACTION_TYPES.Product_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}product/report/saleByProduct?${params}&product=${productId}`,
    isShowLoading,
  };
}

/**Export  */
export function exportPaymentMethod(
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName,
  method = "all"
) {
  return {
    type: ACTION_TYPES.OPM_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/paymentMethod/export?${params}&method=${method}`,
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
  fileName,
  promotionId = 0
) {
  return {
    type: ACTION_TYPES.OME_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/marketingEfficiency/export?${params}&promotionId=${promotionId}`,
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
  fileName,
  giftCardGeneralId = 0
) {
  return {
    type: ACTION_TYPES.GiftCard_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}giftCard/reportSales/export?${params}&giftCardGeneralId=${giftCardGeneralId}`,
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

/**===================
 * customer
 * ==================*/

// get list
export function getCustomerSales(
  isShowLoading = true,
  params = "quickFilter=thisWeek"
) {
  return {
    type: ACTION_TYPES.Customer_GetList,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}appointment/report/customerSales?${params}`,
    isShowLoading,
  };
}

// export report
export function exportCustomerSalesSales(
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.Customer_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}appointment/report/customerSales/export?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

/**Export PRODUCT REPORT */

export function exportProductSaleByCategory(
  categoryId = "top5",
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.ProductCategory_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}product/report/saleByCategory/export?${params}&category=${categoryId}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportProductSaleByCategoryDetail(
  categoryId,
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.ProductCategory_ExportStatistic,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}product/report/saleByCategory/export/${categoryId}?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportProductSaleByProduct(
  productId = "top5",
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.Product_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}product/report/saleByProduct/export?${params}&product=${productId}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportProductSaleByProductDetail(
  productId,
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.Product_ExportStatistic,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}product/report/saleByProduct/export/${productId}?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

/**Export SERVICE REPORT */

export function exportServiceSaleByCategory(
  categoryId = "top5",
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.ServiceCategory_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}service/report/saleByCategory/export?${params}&category=${categoryId}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportServiceSaleByCategoryDetail(
  categoryId,
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.ServiceCategory_ExportStatistic,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}service/report/saleByCategory/export/${categoryId}?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportServiceSaleByService(
  serviceId = "top5",
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.Service_Export,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}service/report/saleByService/export?${params}&service=${serviceId}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}

export function exportServiceSaleByServiceDetail(
  serviceId,
  params = "quickFilter=thisWeek",
  isShowLoading = true,
  type = "excel",
  fileName
) {
  return {
    type: ACTION_TYPES.Service_ExportStatistic,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}service/report/saleByService/export/${serviceId}?${params}`,
    isShowLoading,
    fileName,
    extention: type === "excel" ? "csv" : "pdf",
  };
}
