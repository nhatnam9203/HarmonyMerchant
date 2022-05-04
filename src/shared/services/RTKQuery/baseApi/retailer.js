export const retailerBuilder = (builder) => ({
  getRetailerAppointment: builder.query({
    query: (appointmentId) => ({
      url: `retailer/appointment/${appointmentId}`,
    }),
  }),

  getProductByBarcode: builder.query({
    query: (barcode) => ({
      url: `product/getbybarcode/${barcode}`,
      method: "GET",
    }),
  }),

  applyCostPriceToAppointment: builder.mutation({
    query: ({ tempAppointmentId, isCostPrice }) => ({
      url: `retailer/appointment/changepriceforbasket/${tempAppointmentId}/change/${isCostPrice}`,
      method: "PUT",
    }),
  }),
});
