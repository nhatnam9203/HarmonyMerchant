import {
  formatMoneyWithUnit,
  formatMoney,
  formatNumberFromCurrency,
  formatWithMoment,
} from "@utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Dash from "react-native-dash";
import { useTranslation } from "react-i18next";
import { fonts, color, layouts } from "@shared/themes";
import { LineHeader, LineItem } from "./ReceiptLine";
import Barcode from "@kichiyaki/react-native-barcode-generator";

export const ReceiptFooter = ({
  fromAppointmentTab,
  profile,
  typeReceipt,
  invoiceCode,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {fromAppointmentTab && <View style={{ height: scaleHeight(200) }} />}
      {profile?.receiptFooter ? (
        <TextLabel>{` ${profile?.receiptFooter}`}</TextLabel>
      ) : (
        <TextLabel>{`Thank you!\nPlease come again`}</TextLabel>
      )}
      {/* ------------- Promotions Note   ----------- */}

      <TextLabel>{`********* ${typeReceipt} *********`}</TextLabel>
      {!!invoiceCode && (
        <Barcode
          format="CODE128"
          value={invoiceCode + ""}
          text={`${invoiceCode}`}
          style={{ marginBottom: 10 }}
          maxWidth={scaleWidth(260)}
        />
      )}
    </View>
  );
};

const TextLabel = ({ children, numberOfLines = 0 }) => (
  <Text style={styles.textLabelStyle} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textLabelStyle: {
    fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(16),
    fontWeight: "400",
    textAlign: "center",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },
});
