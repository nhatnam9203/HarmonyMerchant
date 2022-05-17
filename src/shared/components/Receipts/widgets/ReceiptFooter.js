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
  widthPaper,
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
        <>
          <View style={styles.margin} />
          <Text style={styles.textLabelStyle}>
            {`Discount note: `}
            <Text
              style={[styles.textLabelStyle, { fontWeight: "600" }]}
            >{`${promotionNotes}`}</Text>
          </Text>
          <View style={styles.margin} />
        </>
      ) : null}

      <TextLabel>{`********* ${typeReceipt ?? "Receipt"} *********`}</TextLabel>
      <View style={styles.margin} />
      <View style={styles.margin} />

      {!!invoiceCode && (
        <Barcode
          format="CODE39"
          value={`${invoiceCode}`}
          text={`${invoiceCode}`}
          // textStyle={styles.textBarcode}
          style={{ marginBottom: 10 }}
          maxWidth={widthPaper ? parseFloat(widthPaper) : scaleWidth(300)}
          height={scaleHeight(85)}
          textStyle={styles.textBarcodeStyle}
        />
      )}
      <View style={styles.margin} />
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
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(20),
    fontWeight: "500",
    textAlign: "center",
  },
  textBarcode: {
    fontSize: scaleFont(20),
  },

  textBarcodeStyle: {
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(16),
    fontWeight: "500",
    textAlign: "center",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },
});
