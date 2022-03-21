import Barcode from "@kichiyaki/react-native-barcode-generator";
import { fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export const ReceiptFooter = ({
  fromAppointmentTab,
  profile,
  typeReceipt,
  invoiceCode,
  promotionNotes,
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
      {promotionNotes ? (
        <Text style={styles.textLabelStyle}>
          {`Discount note: `}
          <Text
            style={[styles.textLabelStyle, { fontWeight: "600" }]}
          >{`${promotionNotes}`}</Text>
        </Text>
      ) : null}
      <TextLabel>{`********* ${typeReceipt ?? "Receipt"} *********`}</TextLabel>
      <View style={styles.margin} />
      {!!invoiceCode && (
        <Barcode
          format="CODE128"
          value={invoiceCode + ""}
          text={`${invoiceCode}`}
          style={{ marginBottom: 10 }}
          maxWidth={scaleWidth(280)}
          height={scaleHeight(50)}
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
    fontSize: scaleFont(17),
    fontWeight: "500",
    textAlign: "center",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },
});
