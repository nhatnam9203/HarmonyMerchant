export const getProductByBarcode = (barcode) => ({
  queryId: "getProductByBarcode",
  params: {
    url: `product/getbybarcode/${barcode}`,
    method: "GET",
  },
});

export const applyCostPriceToAppointment = (
  tempAppointmentId,
  isCostPrice
) => ({
  queryId: "applyCostPriceToAppointment",
  params: {
    url: `retailer/appointment/changepriceforbasket/${tempAppointmentId}/change/${isCostPrice}`,
    method: "PUT",
  },
});
