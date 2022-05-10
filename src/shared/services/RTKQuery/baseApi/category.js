export const categoryBuilder = (builder) => ({
  getCategoriesByStaff: builder.query({
    query: (staffId) => ({
      url: `category/getByStaff/${staffId}`,
      method: "GET",
      timeOut: 120000,
    }),
  }),
});
