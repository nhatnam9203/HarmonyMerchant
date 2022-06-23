export const retailerBuilder = (builder) => ({
  retailerSaleOverallExport: builder.query({
    query: (params) => {
      return {
        url: `retailer/Appointment/report/sale/overall/export`,
        params: params,
      };
    },
  }),
});
