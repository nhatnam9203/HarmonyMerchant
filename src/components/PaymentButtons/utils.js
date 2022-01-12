export const getPaymentString = (type) => {
  let method = "";
  switch (type) {
    case "HarmonyPay":
      method = "harmony";
      break;
    case "Cash":
      method = "cash";
      break;
    case "Credit Card":
      method = "credit_card";
      break;
    case "Debit Card":
      method = "credit_card";
      break;
    case "Gift Card":
    case "GiftCard":
      method = "giftcard";
      break;
    case "Other":
      method = "other";
      break;
    default:
      method = "";
  }
  return method;
};

export const PAYMENT_METHOD = {
  GIFT_CARD: "giftcard",
};
