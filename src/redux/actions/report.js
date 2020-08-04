import apiConfigs from "../../configs/api";

export const ACTION_TYPES = {
  GetOverallPaymentMethod: "GET_REPORT_OVERALL_PAYMENT_METHOD",
  OverallPaymentMethodFilterId: "REPORT_OVERALL_PAYMENT_METHOD_FILTER_ID",
  GetOverallMarketingEfficiency: "GET_REPORT_OVERALL_MARKETING_EFFICIENCY",
};

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

export function filterOverallPaymentMethod(method) {
  return {
    type: ACTION_TYPES.OverallPaymentMethodFilterId,
    payload: method,
  };
}

export function getOverallMarketingEfficiency(
  isShowLoading = true,
  params = "quickFilter=thisWeek"
) {
  return {
    type: ACTION_TYPES.GetOverallMarketingEfficiency,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/marketingEfficiency?${params}`,
    isShowLoading,
  };
}
