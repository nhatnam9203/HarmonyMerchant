export const selectPaymentMethod = (checkoutGroupId, data) => ({
  queryId: "selectPaymentMethod",
  params: {
    url: `appointment/selectpaymentmethod/${checkoutGroupId}`,
    method: "PUT",
    data,
  },
});

export const checkoutSubmit = (appointmentId) => ({
  queryId: "checkoutSubmit",
  params: {
    url: `checkout/submit/${appointmentId}`,
    method: "PUT",
    data: {},
  },
});

export const checkoutAppointment = (appointmentId) => ({
  queryId: "checkoutAppointment",
  params: {
    url: `appointment/checkout/${appointmentId}`,
    method: "PUT",
    data: {},
  },
});

export const checkGiftCard = (serialNumber) => ({
  queryId: "checkGiftCard",
  params: {
    url: `giftcard/serialNumber/${serialNumber}?isActive=${true}`,
    method: "GET",
  },
});

export const cancelHarmonyPayment = (payAppointmentId, data) => ({
  queryId: "cancelHarmonyPayment",
  params: {
    url: `appointment/cancelmethod/${payAppointmentId}`,
    method: "PUT",
    data,
  },
});
