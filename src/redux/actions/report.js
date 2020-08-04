import apiConfigs from "../../configs/api";

/**
 * OPM: Overall Payment Method
 */
export const ACTION_TYPES = {
  GetOverallPaymentMethod: "GET_REPORT_OVERALL_PAYMENT_METHOD",
  OPMFilters: "REPORT_OVERALL_PAYMENT_METHOD_FILTERS",
  OPMFilterId: "REPORT_OVERALL_PAYMENT_METHOD_FILTER_ID",
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

export function getOPMFilters(filters) {
  return {
    type: ACTION_TYPES.OPMFilters,
    payload: filters,
  };
}

export function filterOPM(method) {
  return {
    type: ACTION_TYPES.OPMFilterId,
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
