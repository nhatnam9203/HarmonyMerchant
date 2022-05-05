export const staffBuilder = (builder) => ({
  staffLogTimeReport: builder.query({
    query: (params) => {
      return {
        url: `MerchantStaffLogtime/logtime`,
        params: params,
      };
    },
  }),

  exportStaffLogTimeReport: builder.query({
    query: (params) => {
      return {
        url: `MerchantStaffLogtime/logtime/export`,
        params: params,
      };
    },
  }),
});
