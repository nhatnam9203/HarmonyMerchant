export const serviceBuilder = (builder) => ({
  getServiceByStaff: builder.query({
    query: ({ categoryId, staffId }) => ({
      url: `service/getbycategory/${categoryId}?staffId=${staffId}`,
      method: "GET",
    }),
  }),
});
