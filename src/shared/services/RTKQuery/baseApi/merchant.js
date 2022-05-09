export const merchantBuilder = (builder) => ({
  getMerchantGeneral: builder.query({
    query: (merchantId) => ({
      url: `merchant/${merchantId}`,
      method: "GET",
    }),
  }),
});
