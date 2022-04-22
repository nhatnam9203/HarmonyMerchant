export const staffBuilder = (builder) => ({
  staffLogin: builder.mutation({
    query: ({ merchantID, pinCode }) => ({
      url: `staff/login`,
      method: "POST",
      data: {
        merchantCode: merchantID,
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
});
