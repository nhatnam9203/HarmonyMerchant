export const staffBuilder = (builder) => ({
  staffLogin: builder.mutation({
    query: ({ merchantId, pinCode }) => ({
      url: `staff/login`,
      method: "POST",
      data: {
        merchantCode: merchantId,
        staffPin: pinCode,
      },
    }),
  }),

  staffLogTimeGetList: builder.query({
    query: (params) => ({
      url: `MerchantStaffLogtime`,
      params: params,
    }),
  }),

  staffLogTimeEdit: builder.mutation({
    query: (id) => ({
      url: `MerchantStaffLogtime/${id}`,
      method: "PUT",
    }),
  }),

  staffLogTimeDelete: builder.mutation({
    query: (id) => ({
      url: `MerchantStaffLogtime/delete/${id}`,
      method: "DELETE",
    }),
  }),

  staffLogTimeCreate: builder.mutation({
    query: (data) => ({
      url: `MerchantStaffLogtime`,
      method: "POST",
      data,
    }),
  }),

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
