export const checkGiftCardSerialNumber = (serialNumber) => ({
  queryId: "checkGiftCardSerialNumber",
  params: {
    url: `/GiftCard/serialNumber/${serialNumber}`,
    method: "GET",
  },
});
