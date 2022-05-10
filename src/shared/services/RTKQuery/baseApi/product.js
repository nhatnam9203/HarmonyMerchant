export const productBuilder = (builder) => ({
  getProductByStaff: builder.query({
    query: (categoryId) => ({
      url: `product/getbycategory/${categoryId}`,
      method: "GET",
    }),
  }),
});
