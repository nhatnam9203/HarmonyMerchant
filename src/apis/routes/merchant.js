export const getMerchantGeneral = (merchantId) => ({
  queryId: "getMerchantGeneral",
  params: {
    url: `merchant/${merchantId}`,
    method: "GET",
  },
});
