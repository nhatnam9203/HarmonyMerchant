export const checkConsumerPayToken = (token) => ({
  queryId: "checkConsumerPayToken",
  params: {
    url: `/Consumer`,
    method: "GET",
    params: { token },
  },
});

export const submitConsumerPayment = (checkoutPaymentId, token) => ({
  queryId: "submitConsumerPayment",
  params: {
    url: `/Consumer/submit/${checkoutPaymentId}?token=${token}`,
    method: "PUT",
  },
});
