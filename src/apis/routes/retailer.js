export const getProductByBarcode = (barcode) => ({
  queryId: "getProductByBarcode",
  params: {
    url: `product/getbybarcode/${barcode}`,
    method: "GET",
  },
});


// export const