import { Button, Text } from "@components";
import ICON from "@resources";
import { checkIsTablet, scaleSize } from "@utils";
import React from "react";
import { Image, Platform } from "react-native";

function getPaymentLogoByName(name) {
  let logo = "";
  switch (name) {
    case "HarmonyPay":
      logo = "harmony_payment";
      break;
    case "Cash":
      logo = "cash_payment";
      break;
    case "Credit Card":
      logo = "credit_payment";
      break;
    case "Debit Card":
      logo = "debit_payment";
      break;
    case "Gift Card":
      logo = "giftcard_payment";
      break;
    case "Other":
      logo = "other_payment";
      break;
    default:
      logo = "harmony_payment";
  }
  return logo;
}

export const ButtonPaymentMethod = ({
  title,
  selectedPayment,
  paymentSelected,
}) => {
  const temptBackground =
    title === paymentSelected ? { backgroundColor: "#0764B0" } : {};
  const temptTextColor = title === paymentSelected ? { color: "#fff" } : {};
  const logo = getPaymentLogoByName(title);
  const tempLogo = title === paymentSelected ? `${logo}_se` : logo;

  const isTablet = checkIsTablet();
  const tempHeight = isTablet ? scaleSize(65) : scaleSize(80);
  const icon_style = isTablet
    ? { width: scaleSize(30), height: scaleSize(30) }
    : {};
  const tempTitleMarginTop = isTablet ? scaleSize(2) : scaleSize(8);

  return (
    <Button
      onPress={() => selectedPayment(title)}
      style={[
        {
          width: scaleSize(190),
          height: tempHeight,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }),
        },
        temptBackground,
      ]}
    >
      <Image source={ICON[tempLogo]} style={icon_style} />
      <Text
        style={[
          {
            fontSize: scaleSize(13),
            color: "#404040",
            marginTop: tempTitleMarginTop,
          },
          temptTextColor,
        ]}
      >
        {title}
      </Text>
    </Button>
  );
};
