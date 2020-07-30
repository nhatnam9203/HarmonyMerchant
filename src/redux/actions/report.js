import apiConfigs from "../../configs/api";

export const TC = {
  GetOverallPaymentMethod: "GET_REPORT_OVERALL_PAYMENT_METHOD",
  GetOverallMarketingEfficiency: "GET_REPORT_OVERALL_MARKETING_EFFICIENCY",
};

export function getOverallPaymentMethod(
  isShowLoading = true,
  params = "quickFilter=thisWeek"
) {
  return {
    type: TC.GetOverallPaymentMethod,
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
    type: TC.GetOverallMarketingEfficiency,
    method: "GET",
    token: true,
    api: `${apiConfigs.BASE_API}overall/marketingEfficiency?${params}`,
    isShowLoading,
  };
}
